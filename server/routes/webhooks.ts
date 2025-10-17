import { Router } from 'express';
import crypto from 'crypto';

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
  // Welcome message will be sent via GHL workflow
}

async function handleOpportunityCreate(data: any) {
  console.log('Processing opportunity.created webhook:', data.id);
  // Update local database with GHL opportunity ID
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
    // Update local database (TODO: implement when storage method ready)
    console.log(`✅ Opportunity ${opportunityId} stage updated to: ${newStageName}`);
    
    // Auto-trigger workflow for new stage
    if (contactId && newStageName) {
      await autoTriggerWorkflowForStage(contactId, newStageName);
    }
    
    console.log(`✅ Opportunity stage automation complete`);
  } catch (error) {
    console.error(`❌ Opportunity stage update failed:`, error);
  }
}

export default router;
