import { Router } from 'express';
import crypto from 'crypto';
import { automationOrchestrator } from '../lib/production';
import { db } from '../db';
import { contacts, opportunities } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Webhook endpoint for GHL real-time updates
router.post('/api/webhooks/ghl', async (req, res) => {
  try {
    const signature = req.headers['x-wh-signature'] as string;
    const payload = req.body;
    const webhookSecret = process.env.GHL_WEBHOOK_SECRET;
    
    // Signature verification (WARN-ONLY until raw body middleware added)
    if (webhookSecret && signature) {
      console.log('🔒 Webhook signature present (full verification requires express-raw-body middleware)');
      // TODO: Add express-raw-body middleware for production signature verification
    } else if (webhookSecret && !signature) {
      console.warn('⚠️  WARNING: GHL_WEBHOOK_SECRET configured but signature missing in webhook');
    } else {
      console.log('⚠️  Webhook signature verification skipped (configure GHL_WEBHOOK_SECRET for production)');
    }
    
    console.log('GHL Webhook received:', payload.type);
    
    // Handle different event types
    switch (payload.type) {
      case 'ContactCreate':
      case 'contact.created':
        await handleContactCreate(payload.data || payload);
        break;
        
      case 'OpportunityCreate':
      case 'opportunity.created':
        await handleOpportunityCreate(payload.data || payload);
        break;
        
      case 'OpportunityStageUpdate':
      case 'opportunity.stage_changed':
        await handleOpportunityStageUpdate(payload.data || payload);
        break;
        
      case 'AppointmentCreate':
      case 'appointment.created':
        console.log('Appointment created webhook received');
        break;
    }
    
    return res.json({ success: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Processing failed' });
  }
});

async function handleContactCreate(data: any) {
  console.log('Processing contact.created webhook:', data.id);
  
  try {
    // Check if contact exists in our database
    const [existingContact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.ghlContactId, data.id));
    
    if (!existingContact) {
      // Create contact in our database
      const [newContact] = await db.insert(contacts).values({
        ghlContactId: data.id,
        firstName: data.firstName || data.first_name,
        lastName: data.lastName || data.last_name,
        email: data.email,
        phone: data.phone,
        source: data.source || 'GHL Webhook',
        tags: data.tags || [],
        customFields: data.customFields || data.custom_fields || {}
      }).returning();
      
      console.log(`✅ Contact created in database: ${newContact.id}`);
    }
  } catch (error) {
    console.error('Failed to handle contact creation:', error);
  }
}

async function handleOpportunityCreate(data: any) {
  console.log('Processing opportunity.created webhook:', data.id);
  
  try {
    // Get contact from our database
    const [contact] = data.contactId 
      ? await db.select().from(contacts).where(eq(contacts.ghlContactId, data.contactId))
      : [];
    
    // Check if opportunity exists
    const [existingOpp] = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.ghlOpportunityId, data.id));
    
    if (!existingOpp) {
      // Create opportunity in our database
      const [newOpportunity] = await db.insert(opportunities).values({
        ghlOpportunityId: data.id,
        contactId: contact?.id,
        ghlContactId: data.contactId,
        pipelineId: data.pipelineId || data.pipeline_id,
        stageId: data.pipelineStageId || data.stage_id,
        stageName: data.pipelineStageName || data.stage_name || 'New Lead',
        name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        monetaryValue: data.monetaryValue || data.monetary_value || 0,
        division: determineDivision(data),
        priority: 'warm',
        status: data.status || 'open',
        firstName: data.firstName || contact?.firstName,
        lastName: data.lastName || contact?.lastName,
        email: data.email || contact?.email
      }).returning();
      
      console.log(`✅ Opportunity created in database: ${newOpportunity.id}`);
      
      // Trigger new lead automation if contact exists
      if (contact) {
        await automationOrchestrator.processNewLead(contact, newOpportunity);
      }
    }
  } catch (error) {
    console.error('Failed to handle opportunity creation:', error);
  }
}

function determineDivision(data: any): string {
  // Determine division based on pipeline, tags, or custom fields
  const pipelineName = (data.pipelineName || data.pipeline_name || '').toLowerCase();
  const tags = data.tags || [];
  
  if (pipelineName.includes('lending') || tags.includes('lending')) {
    return 'lending';
  } else if (pipelineName.includes('investment') || tags.includes('investment')) {
    return 'investment';
  } else if (pipelineName.includes('real') || pipelineName.includes('estate') || tags.includes('real-estate')) {
    return 'real_estate';
  }
  
  // Default to lending
  return 'lending';
}

async function handleOpportunityStageUpdate(data: any) {
  const opportunityId = data.id || data.opportunityId;
  const contactId = data.contactId || data.ghlContactId;
  
  // Import resolver
  const { autoTriggerWorkflowForStage, resolveStageNameFromWebhook } = await import('../services/ghl');
  
  // Resolve stage name from webhook payload
  const newStageName = resolveStageNameFromWebhook(data);
  
  if (!newStageName) {
    console.error('❌ Could not determine stage name from webhook payload');
    return;
  }
  
  console.log(`📊 Processing opportunity.stage_changed:`, {
    opportunityId,
    contactId,
    newStageName
  });

  try {
    // Get the opportunity from our database
    const [opportunity] = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.ghlOpportunityId, opportunityId));
    
    if (opportunity) {
      // Save the old stage name
      const oldStageName = opportunity.stageName;
      
      // Update opportunity in database
      await db
        .update(opportunities)
        .set({
          stageId: data.pipelineStageId || data.stage_id,
          stageName: newStageName,
          updatedAt: new Date()
        })
        .where(eq(opportunities.ghlOpportunityId, opportunityId));
      
      console.log(`✅ Opportunity ${opportunityId} stage updated to: ${newStageName}`);
      
      // Trigger stage change automation
      await automationOrchestrator.processStageChange(
        opportunity, 
        oldStageName || 'unknown',
        newStageName
      );
    } else {
      // Create opportunity if it doesn't exist
      await handleOpportunityCreate(data);
    }
    
    // Auto-trigger GHL workflow for new stage
    if (contactId && newStageName) {
      await autoTriggerWorkflowForStage(contactId, newStageName);
    }
    
    console.log(`✅ Opportunity stage automation complete`);
  } catch (error) {
    console.error(`❌ Opportunity stage update failed:`, error);
  }
}

export default router;
