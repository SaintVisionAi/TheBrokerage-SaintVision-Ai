import type { Request, Response } from 'express';

// Simple in-memory rate limiter (per contact)
const smsRateLimiter = new Map<string, number[]>();
const emailRateLimiter = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_SMS_PER_MINUTE = 5;
const MAX_EMAIL_PER_MINUTE = 3;

function checkRateLimit(limiter: Map<string, number[]>, contactId: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const timestamps = limiter.get(contactId) || [];
  
  // Remove timestamps older than 1 minute
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (recentTimestamps.length >= maxPerMinute) {
    console.warn(`⚠️  Rate limit exceeded for contact ${contactId}`);
    return false; // Rate limit exceeded
  }
  
  // Add current timestamp
  recentTimestamps.push(now);
  limiter.set(contactId, recentTimestamps);
  
  return true; // OK to proceed
}

// EXACT Pipeline Stages from GHL CRM - LENDING PIPELINE (12 stages)
export const LENDING_PIPELINE_STAGES = {
  NEW_LEAD: 'New Lead',
  CONTACTED: 'Contacted',
  NO_SHOW: 'No-show',
  PRE_QUALIFIED: 'Pre Qualified -Apply Now-SVG2',
  DOCUMENTS_PENDING: 'Documents pending',
  FULL_APPLICATION_COMPLETE: 'Full Application Complete',
  SENT_TO_LENDER: 'Sent to Lender',
  DOCUMENTS_PENDING_FOLLOWUP: 'Documents Pending and Follow Up',
  SIGNATURE_QUALIFIED: 'Signature/Qualified',
  DISQUALIFIED: 'Disqualified',
  FUNDED: 'Funded $',
  AMOUNT_WON: 'Amount Won $'
} as const;

// Pipeline stage progression order (12 stages)
export const PIPELINE_STAGE_ORDER = [
  LENDING_PIPELINE_STAGES.NEW_LEAD,
  LENDING_PIPELINE_STAGES.CONTACTED,
  LENDING_PIPELINE_STAGES.NO_SHOW,
  LENDING_PIPELINE_STAGES.PRE_QUALIFIED,
  LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING,
  LENDING_PIPELINE_STAGES.FULL_APPLICATION_COMPLETE,
  LENDING_PIPELINE_STAGES.SENT_TO_LENDER,
  LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING_FOLLOWUP,
  LENDING_PIPELINE_STAGES.SIGNATURE_QUALIFIED,
  LENDING_PIPELINE_STAGES.DISQUALIFIED,
  LENDING_PIPELINE_STAGES.FUNDED,
  LENDING_PIPELINE_STAGES.AMOUNT_WON
];

// Stage ID to Stage Name mapping (GHL sends IDs in webhooks)
export const STAGE_ID_TO_NAME: Record<string, string> = {
  // SVG Lending Pipeline - Stage IDs fetched from GHL API
  '37732fed-7a26-4cc8-8b5f-8edf26626232': 'New Lead',
  '0bda77d5-6c1d-477f-a273-7bdaccb48361': 'Contacted',
  '5688280e-e84c-47a6-9790-0303c8a90cbd': 'No-show',
  'bbf09ba7-aac4-4c30-95b4-70e03726619e': 'Pre Qualified -Apply Now-SVG2',
  '266a7ef9-36b0-40c7-883c-c15eab2bd005': 'Documents pending',
  'f195be1f-d028-42d3-990f-c78a65555ebc': 'Full Application Complete',
  '29225300-ce86-46b0-89c3-fb11688042a4': 'Sent to Lender',
  'b871af50-bea5-4691-8754-2e929380ffa6': 'Documents Pending and Follow Up',
  '4531fb3e-06c3-4931-9ce9-72dca9650bd4': 'Signature/Qualified',
  '28b8ae8b-63ee-43f2-a886-144aa250345e': 'Disqualified',
  '41a06617-2975-4bf9-ae97-0561df2bcbae': 'Funded $',
  'add3a843-133b-4822-a783-b2c443cadfe4': 'Amount Won $'
};

// Helper to resolve stage name from webhook data
export function resolveStageNameFromWebhook(data: any): string | null {
  // Try multiple fields to find stage name
  const stageName = data.stageName || data.status || data.pipelineStageName;
  
  if (stageName) {
    return stageName;
  }
  
  // Try to map stage ID to name
  const stageId = data.pipelineStageId || data.stageId;
  if (stageId && STAGE_ID_TO_NAME[stageId]) {
    return STAGE_ID_TO_NAME[stageId];
  }
  
  // Fallback: return raw stage ID (workflow registry might have it)
  if (stageId) {
    console.log(`ℹ️  Using raw stageId: ${stageId} (configure STAGE_ID_TO_NAME mapping for proper resolution)`);
    return stageId;
  }
  
  console.warn('⚠️  Could not resolve stage name from webhook data:', JSON.stringify(data).substring(0, 200));
  return null;
}

// Workflow Registry - Map ALL 12 pipeline stages to GHL Workflow IDs
export const WORKFLOW_REGISTRY: Record<string, string | undefined> = {
  // Stage NAME mappings (for manual triggers and webhook fallback) - ALL 12 STAGES
  [LENDING_PIPELINE_STAGES.NEW_LEAD]: '4b41f21d-da89-4515-915e-ad41e95c033d', // Apply Now Form
  [LENDING_PIPELINE_STAGES.CONTACTED]: '4b41f21d-da89-4515-915e-ad41e95c033d', // Apply Now Form (follow-up)
  [LENDING_PIPELINE_STAGES.NO_SHOW]: '4d3cd0c5-aaeb-4039-a2f7-53f615a5e28b', // Appointment Confirmation + Reminder (re-engage)
  [LENDING_PIPELINE_STAGES.PRE_QUALIFIED]: '4b41f21d-da89-4515-915e-ad41e95c033d', // Apply Now Form (continuation)
  [LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING]: 'eb0d9bb1-3980-4953-b273-28fe250f16ef', // Document Follow-Up With Lender
  [LENDING_PIPELINE_STAGES.FULL_APPLICATION_COMPLETE]: '44ade1a7-59fb-4383-a242-73e313d74132', // Full Package Completed
  [LENDING_PIPELINE_STAGES.SENT_TO_LENDER]: 'eb0d9bb1-3980-4953-b273-28fe250f16ef', // Document Follow-Up (waiting notification)
  [LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING_FOLLOWUP]: 'd7091b12-d4ff-447c-aacf-d0eee1325ee0', // From Lender - Documents Pending
  [LENDING_PIPELINE_STAGES.SIGNATURE_QUALIFIED]: '0af969bc-32f4-4a6c-8a34-f9e3a90ca893', // Checking Final documents Signatures
  [LENDING_PIPELINE_STAGES.DISQUALIFIED]: 'e0c5048a-961d-4624-aa49-4ed68f27331f', // Disqualified
  [LENDING_PIPELINE_STAGES.FUNDED]: 'e9d7cc91-8a79-4d3f-9a3f-27b0da97b5ca', // Funded
  [LENDING_PIPELINE_STAGES.AMOUNT_WON]: 'e9d7cc91-8a79-4d3f-9a3f-27b0da97b5ca', // Funded (celebration)
  
  // Stage ID mappings (for webhook automation - GHL sends stage IDs) - ALL 12 STAGES
  '37732fed-7a26-4cc8-8b5f-8edf26626232': '4b41f21d-da89-4515-915e-ad41e95c033d', // New Lead → Apply Now Form
  '0bda77d5-6c1d-477f-a273-7bdaccb48361': '4b41f21d-da89-4515-915e-ad41e95c033d', // Contacted → Apply Now Form
  '5688280e-e84c-47a6-9790-0303c8a90cbd': '4d3cd0c5-aaeb-4039-a2f7-53f615a5e28b', // No-show → Appointment Confirmation
  'bbf09ba7-aac4-4c30-95b4-70e03726619e': '4b41f21d-da89-4515-915e-ad41e95c033d', // Pre Qualified → Apply Now Form
  '266a7ef9-36b0-40c7-883c-c15eab2bd005': 'eb0d9bb1-3980-4953-b273-28fe250f16ef', // Documents pending → Document Follow-Up
  'f195be1f-d028-42d3-990f-c78a65555ebc': '44ade1a7-59fb-4383-a242-73e313d74132', // Full Application → Full Package Completed
  '29225300-ce86-46b0-89c3-fb11688042a4': 'eb0d9bb1-3980-4953-b273-28fe250f16ef', // Sent to Lender → Document Follow-Up
  'b871af50-bea5-4691-8754-2e929380ffa6': 'd7091b12-d4ff-447c-aacf-d0eee1325ee0', // Documents Pending and Follow Up → From Lender
  '4531fb3e-06c3-4931-9ce9-72dca9650bd4': '0af969bc-32f4-4a6c-8a34-f9e3a90ca893', // Signature/Qualified → Checking Signatures
  '28b8ae8b-63ee-43f2-a886-144aa250345e': 'e0c5048a-961d-4624-aa49-4ed68f27331f', // Disqualified → Disqualified workflow
  '41a06617-2975-4bf9-ae97-0561df2bcbae': 'e9d7cc91-8a79-4d3f-9a3f-27b0da97b5ca', // Funded $ → Funded workflow
  'add3a843-133b-4822-a783-b2c443cadfe4': 'e9d7cc91-8a79-4d3f-9a3f-27b0da97b5ca', // Amount Won $ → Funded workflow (celebration)
};

// Auto-trigger workflow based on stage
export async function autoTriggerWorkflowForStage(contactId: string, stageName: string) {
  const workflowId = WORKFLOW_REGISTRY[stageName];
  
  if (!workflowId) {
    console.log(`ℹ️  No workflow configured for stage: ${stageName} (set GHL_*_WORKFLOW_ID env vars)`);
    return { success: false, message: 'No workflow for stage' };
  }

  console.log(`🔄 Auto-triggering workflow ${workflowId} for contact ${contactId} at stage ${stageName}`);
  
  try {
    const result = await triggerGHLWorkflowById(contactId, workflowId);
    
    if (result.success) {
      console.log(`✅ Workflow triggered successfully for stage ${stageName}`);
    } else {
      console.error(`❌ Workflow trigger failed:`, result);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Workflow trigger exception:`, error);
    return { success: false, error: String(error) };
  }
}

interface GHLLeadData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  service: 'real-estate' | 'lending' | 'investments' | 'general' | 'real-estate-brokerage' | 'real-estate-finance';
  type?: string;
  notes?: string;
  source?: string;
  pipelineStage?: typeof LENDING_PIPELINE_STAGES[keyof typeof LENDING_PIPELINE_STAGES];
  loanAmount?: string;
  businessRevenue?: string;
  creditScore?: string;
}

interface GHLContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tags: string[];
  customFields: {
    service_type: string;
    inquiry_type?: string;
    lead_source: string;
    pipeline_stage?: string;
    loan_amount?: string;
    business_revenue?: string;
    credit_score_range?: string;
  };
}

export async function captureGHLLead(leadData: GHLLeadData) {
  try {
    // Determine initial pipeline stage based on service and form type
    let initialStage: typeof LENDING_PIPELINE_STAGES[keyof typeof LENDING_PIPELINE_STAGES] = LENDING_PIPELINE_STAGES.NEW_LEAD;
    
    if (leadData.service === 'lending') {
      if (leadData.source === 'pricing-application' || leadData.source === 'pre-qualification-form') {
        initialStage = LENDING_PIPELINE_STAGES.PRE_QUALIFIED;
      }
    }

    const contact: GHLContact = {
      firstName: leadData.firstName || 'Lead',
      lastName: leadData.lastName || 'Prospect',
      email: leadData.email,
      phone: leadData.phone,
      tags: [
        'saintvision-ai-brokerage',
        `service-${leadData.service}`,
        leadData.type ? `inquiry-${leadData.type}` : 'general-inquiry',
        `stage-${initialStage.toLowerCase().replace(/\s+/g, '-')}`
      ],
      customFields: {
        service_type: leadData.service,
        inquiry_type: leadData.type || 'general',
        lead_source: leadData.source || 'website',
        pipeline_stage: initialStage,
        loan_amount: leadData.loanAmount,
        business_revenue: leadData.businessRevenue,
        credit_score_range: leadData.creditScore
      }
    };

    // TODO: Replace with actual GHL API endpoint when configured
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'NgUphdsMGXpRO3h98XyG';
    const GHL_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || process.env.GHL_API_KEY;

    if (!GHL_TOKEN || !GHL_LOCATION_ID) {
      console.log('GHL API not configured - Lead captured locally:', contact);
      return { success: true, message: 'Lead captured (GHL not configured)', contact };
    }

    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        ...contact,
        locationId: GHL_LOCATION_ID
      })
    });

    if (!response.ok) {
      throw new Error(`GHL API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Lead successfully sent to GHL:', result);

    // Create opportunity in pipeline
    if (result.contact?.id && leadData.service === 'lending') {
      await createGHLOpportunity({
        contactId: result.contact.id,
        pipelineStage: initialStage,
        monetaryValue: leadData.loanAmount ? parseFloat(leadData.loanAmount.replace(/[^0-9.]/g, '')) : 0,
        name: `${contact.firstName} ${contact.lastName} - ${leadData.type || 'Lending'}`
      });
    }

    return { success: true, message: 'Lead captured successfully', data: result };
  } catch (error) {
    console.error('GHL Lead Capture Error:', error);
    return { success: false, message: 'Lead capture failed', error: String(error) };
  }
}

// Create opportunity in GHL pipeline
export async function createGHLOpportunity(data: {
  contactId: string;
  pipelineStage: string;
  monetaryValue?: number;
  name: string;
}) {
  try {
    const GHL_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || process.env.GHL_API_KEY;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'NgUphdsMGXpRO3h98XyG';
    
    if (!GHL_TOKEN || !GHL_LOCATION_ID) {
      console.log('GHL API not configured - Opportunity creation skipped');
      return { success: false, message: 'GHL not configured' };
    }

    const response = await fetch(`https://rest.gohighlevel.com/v1/pipelines/opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        contactId: data.contactId,
        pipelineStage: data.pipelineStage,
        monetaryValue: data.monetaryValue || 0,
        name: data.name,
        status: 'open'
      })
    });

    if (!response.ok) {
      throw new Error(`GHL Opportunity API error: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, message: 'Opportunity created', data: result };
  } catch (error) {
    console.error('GHL Opportunity Creation Error:', error);
    return { success: false, message: 'Opportunity creation failed', error: String(error) };
  }
}

// Move contact to next pipeline stage
export async function updatePipelineStage(contactId: string, opportunityId: string, newStage: string) {
  try {
    const GHL_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || process.env.GHL_API_KEY;
    
    if (!GHL_TOKEN) {
      console.log('GHL API not configured - Pipeline update skipped');
      return { success: false, message: 'GHL not configured' };
    }

    const response = await fetch(`https://rest.gohighlevel.com/v1/pipelines/opportunities/${opportunityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        pipelineStage: newStage
      })
    });

    if (!response.ok) {
      throw new Error(`GHL Pipeline Update error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`Contact ${contactId} moved to stage: ${newStage}`);
    
    return { success: true, message: 'Pipeline stage updated', data: result };
  } catch (error) {
    console.error('GHL Pipeline Update Error:', error);
    return { success: false, message: 'Pipeline update failed', error: String(error) };
  }
}

// Get contact's current pipeline status
export async function getContactPipelineStatus(contactId: string) {
  try {
    const GHL_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || process.env.GHL_API_KEY;
    
    if (!GHL_TOKEN) {
      return { success: false, message: 'GHL not configured' };
    }

    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Version': '2021-07-28'
      }
    });

    if (!response.ok) {
      throw new Error(`GHL API error: ${response.statusText}`);
    }

    const result = await response.json();
    return { 
      success: true, 
      data: {
        contact: result.contact,
        pipelineStage: result.contact?.customFields?.pipeline_stage || LENDING_PIPELINE_STAGES.NEW_LEAD
      }
    };
  } catch (error) {
    console.error('GHL Get Contact Error:', error);
    return { success: false, message: 'Failed to get contact status', error: String(error) };
  }
}

export async function triggerGHLWorkflow(workflowId: string, contactId: string) {
  try {
    const GHL_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || process.env.GHL_API_KEY;
    
    if (!GHL_TOKEN) {
      console.log('GHL API not configured - Workflow trigger skipped (set GHL_PRIVATE_ACCESS_TOKEN)');
      return { success: false, message: 'GHL not configured' };
    }

    const response = await fetch(`https://rest.gohighlevel.com/v1/workflows/${workflowId}/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Version': '2021-07-28'
      },
      body: JSON.stringify({ contactId })
    });

    if (!response.ok) {
      throw new Error(`GHL Workflow API error: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, message: 'Workflow triggered', data: result };
  } catch (error) {
    console.error('GHL Workflow Trigger Error:', error);
    return { success: false, message: 'Workflow trigger failed', error: String(error) };
  }
}

// POST /conversations/messages - Send SMS
export async function sendSMSViaGHL(contactId: string, message: string, maxRetries = 3): Promise<any> {
  const GHL_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || process.env.GHL_API_KEY;
  
  if (!GHL_TOKEN) {
    console.log('⚠️  GHL API not configured - SMS skipped');
    return { success: false, message: 'GHL not configured' };
  }

  // Rate limiting check
  if (!checkRateLimit(smsRateLimiter, contactId, MAX_SMS_PER_MINUTE)) {
    console.warn(`❌ SMS rate limit exceeded for contact ${contactId}`);
    return { success: false, error: 'Rate limit exceeded' };
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_TOKEN}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify({
          type: 'SMS',
          contactId: contactId,
          message: message
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GHL SMS API error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ SMS sent successfully to contact ${contactId} (attempt ${attempt})`);
      return { success: true, data: result };
      
    } catch (error) {
      console.error(`❌ SMS attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        console.log(`⏳ Retrying SMS in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        console.error(`❌ SMS failed after ${maxRetries} attempts`);
        return { success: false, error: String(error) };
      }
    }
  }
  
  return { success: false, error: 'Max retries exceeded' };
}

// POST /conversations/messages - Send Email
export async function sendEmailViaGHL(contactId: string, subject: string, htmlBody: string, maxRetries = 3): Promise<any> {
  const GHL_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || process.env.GHL_API_KEY;
  
  if (!GHL_TOKEN) {
    console.log('⚠️  GHL API not configured - Email skipped');
    return { success: false, message: 'GHL not configured' };
  }

  // Rate limiting check
  if (!checkRateLimit(emailRateLimiter, contactId, MAX_EMAIL_PER_MINUTE)) {
    console.warn(`❌ Email rate limit exceeded for contact ${contactId}`);
    return { success: false, error: 'Rate limit exceeded' };
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_TOKEN}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify({
          type: 'Email',
          contactId: contactId,
          subject: subject,
          html: htmlBody
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GHL Email API error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Email sent successfully to contact ${contactId} (attempt ${attempt})`);
      return { success: true, data: result };
      
    } catch (error) {
      console.error(`❌ Email attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        console.log(`⏳ Retrying email in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        console.error(`❌ Email failed after ${maxRetries} attempts`);
        return { success: false, error: String(error) };
      }
    }
  }
  
  return { success: false, error: 'Max retries exceeded' };
}

// POST /contacts/{contactId}/workflow/{workflowId} - Trigger Workflow
export async function triggerGHLWorkflowById(contactId: string, workflowId: string) {
  const GHL_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || process.env.GHL_API_KEY;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'NgUphdsMGXpRO3h98XyG';
  
  if (!GHL_TOKEN) {
    console.log('GHL API not configured - Workflow trigger skipped (set GHL_PRIVATE_ACCESS_TOKEN)');
    return { success: false, message: 'GHL not configured' };
  }

  const response = await fetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}/workflow/${workflowId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID
      })
    }
  );

  if (!response.ok) {
    throw new Error(`GHL Workflow API error: ${response.statusText}`);
  }

  return { success: true, message: 'Workflow triggered' };
}

// Webhook handler for incoming GHL events
export async function handleGHLWebhook(req: Request, res: Response) {
  try {
    const event = req.body;
    
    console.log('GHL Webhook Event Received:', {
      type: event.type,
      timestamp: new Date().toISOString(),
      eventId: event.id || 'unknown'
    });

    // Acknowledge receipt immediately (GHL expects 200 within 5 seconds)
    res.status(200).json({ received: true, eventId: event.id });

    // Process event asynchronously (don't block webhook response)
    processGHLEvent(event).catch(error => {
      console.error('GHL Event Processing Error:', error);
    });

  } catch (error) {
    console.error('GHL Webhook Handler Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Process GHL events asynchronously
async function processGHLEvent(event: any) {
  try {
    switch (event.type) {
      case 'contact.created':
        await handleContactCreated(event.contact);
        break;
      
      case 'contact.updated':
        await handleContactUpdated(event.contact);
        break;
      
      case 'opportunity.created':
        await handleOpportunityCreated(event.opportunity);
        break;
      
      case 'opportunity.stage_changed':
        await handleOpportunityStageChanged(event);
        break;
      
      case 'appointment.created':
        await handleAppointmentCreated(event.appointment);
        break;
      
      case 'appointment.updated':
        await handleAppointmentUpdated(event.appointment);
        break;
      
      case 'conversation.message':
        await handleInboundMessage(event.message);
        break;
      
      case 'PortalLogin':
        await handlePortalLogin(event);
        break;
      
      case 'PortalDocumentUpload':
        await handlePortalDocumentUpload(event);
        break;
      
      default:
        console.log('Unhandled GHL event type:', event.type);
    }
  } catch (error) {
    console.error('GHL Event Processing Failed:', error);
    throw error;
  }
}

// Event Handlers
async function handleContactCreated(contact: any) {
  console.log('Processing contact.created:', {
    id: contact.id,
    name: `${contact.firstName} ${contact.lastName}`,
    email: contact.email
  });
  
  // TODO: Store in local database if needed
  // await storage.syncGHLContact(contact);
}

async function handleContactUpdated(contact: any) {
  console.log('Processing contact.updated:', {
    id: contact.id,
    name: `${contact.firstName} ${contact.lastName}`
  });
  
  // TODO: Update local database
  // await storage.updateGHLContact(contact);
}

async function handleOpportunityCreated(opportunity: any) {
  console.log('Processing opportunity.created:', {
    id: opportunity.id,
    contactId: opportunity.contactId,
    pipelineStage: opportunity.pipelineStage,
    value: opportunity.monetaryValue
  });
  
  // TODO: Create local opportunity record
  // await storage.createGHLOpportunity(opportunity);
  
  // Trigger automated welcome message based on stage
  if (opportunity.pipelineStage === LENDING_PIPELINE_STAGES.NEW_LEAD) {
    await sendAutomatedWelcome(opportunity.contactId, 'new_lead');
  } else if (opportunity.pipelineStage === LENDING_PIPELINE_STAGES.PRE_QUALIFIED) {
    await sendAutomatedWelcome(opportunity.contactId, 'pre_qualified');
  }
}

async function handleOpportunityStageChanged(event: any) {
  const { opportunity, oldStage, newStage } = event;
  
  console.log('Processing opportunity.stage_changed:', {
    opportunityId: opportunity.id,
    contactId: opportunity.contactId,
    oldStage,
    newStage
  });
  
  // TODO: Update local database
  // await storage.updateOpportunityStage(opportunity.id, newStage);
  
  // Trigger stage-specific automation
  await handleStageProgression(opportunity.contactId, opportunity.id, oldStage, newStage);
}

async function handleAppointmentCreated(appointment: any) {
  console.log('Processing appointment.created:', {
    id: appointment.id,
    contactId: appointment.contactId,
    startTime: appointment.startTime,
    title: appointment.title
  });
  
  // TODO: Store appointment in local database
  // await storage.createGHLAppointment(appointment);
  
  // Send confirmation
  await sendAppointmentConfirmation(appointment);
}

async function handleAppointmentUpdated(appointment: any) {
  console.log('Processing appointment.updated:', {
    id: appointment.id,
    status: appointment.appointmentStatus
  });
  
  // TODO: Update local database
  // await storage.updateGHLAppointment(appointment);
  
  // Handle no-shows
  if (appointment.appointmentStatus === 'no_show') {
    await handleNoShow(appointment.contactId);
  }
}

async function handleInboundMessage(message: any) {
  console.log('Processing inbound message:', {
    contactId: message.contactId,
    type: message.type,
    preview: message.body?.substring(0, 50)
  });
  
  // TODO: Process inbound message with SaintBroker AI
  // await processSaintBrokerMessage(message);
}

async function handlePortalLogin(event: any) {
  console.log('Processing PortalLogin event:', {
    contactId: event.contactId || event.data?.contactId,
    timestamp: event.loginTime || event.data?.loginTime || new Date().toISOString()
  });
  
  const { handlePortalLogin: logPortalLogin } = await import('./ghl-portal');
  
  try {
    await logPortalLogin({
      contactId: event.contactId || event.data?.contactId,
      loginTime: event.loginTime || event.data?.loginTime || new Date().toISOString(),
      ipAddress: event.ipAddress || event.data?.ipAddress,
      userAgent: event.userAgent || event.data?.userAgent
    });
    
    console.log('✅ Portal login logged successfully');
  } catch (error) {
    console.error('Failed to log portal login:', error);
  }
}

async function handlePortalDocumentUpload(event: any) {
  console.log('Processing PortalDocumentUpload event:', {
    contactId: event.contactId || event.data?.contactId,
    documentName: event.documentName || event.data?.documentName
  });
  
  const { handlePortalDocumentUpload: logPortalDocUpload } = await import('./ghl-portal');
  
  try {
    await logPortalDocUpload({
      contactId: event.contactId || event.data?.contactId,
      documentId: event.documentId || event.data?.documentId,
      documentName: event.documentName || event.data?.documentName || 'Unknown Document',
      documentUrl: event.documentUrl || event.data?.documentUrl || '',
      uploadTime: event.uploadTime || event.data?.uploadTime || new Date().toISOString()
    });
    
    console.log('✅ Portal document upload logged successfully');
  } catch (error) {
    console.error('Failed to log portal document upload:', error);
  }
}

// Automation Helpers
async function sendAutomatedWelcome(contactId: string, stage: string) {
  try {
    const messages = {
      new_lead: `Welcome to Saint Vision Group! 🙏 We've received your inquiry and our team will reach out within 24 hours. In the meantime, check your email for next steps.`,
      pre_qualified: `Congratulations! 🎉 Your pre-qualification is complete. Next steps: 1) Check your email for credit authorization link, 2) Schedule your discovery call. Our team is standing by to help!`
    };
    
    const message = messages[stage as keyof typeof messages];
    if (message) {
      console.log(`Sending automated welcome (${stage}) to contact:`, contactId);
      await sendSMSViaGHL(contactId, message);
    }
  } catch (error) {
    console.error('Failed to send automated welcome:', error);
  }
}

async function handleStageProgression(contactId: string, opportunityId: string, oldStage: string, newStage: string) {
  try {
    console.log(`Stage progression: ${oldStage} → ${newStage}`);
    
    // Trigger specific automation based on new stage (ALL 11 LENDING PIPELINE STAGES)
    const automations: Record<string, () => Promise<void>> = {
      [LENDING_PIPELINE_STAGES.NEW_LEAD]: async () => {
        console.log('Trigger: New lead captured - send welcome message + initial contact sequence');
      },
      [LENDING_PIPELINE_STAGES.CONTACTED]: async () => {
        console.log('Trigger: First contact made - send follow-up sequence + next steps');
      },
      [LENDING_PIPELINE_STAGES.NO_SHOW]: async () => {
        console.log('Trigger: No-show - send re-engagement sequence + reschedule options');
      },
      [LENDING_PIPELINE_STAGES.PRE_QUALIFIED]: async () => {
        console.log('Trigger: Pre-qualified - send credit auth link + discovery call booking + portal invite');
        
        const { sendPortalInvite } = await import('./ghl-portal');
        try {
          await sendPortalInvite(contactId, 'lending');
          console.log(`✅ Portal invite sent to contact ${contactId} at PRE_QUALIFIED stage`);
        } catch (error) {
          console.error('Failed to send portal invite at PRE_QUALIFIED:', error);
        }
      },
      [LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING]: async () => {
        console.log('Trigger: Documents pending - send portal invite if not already sent + generating upload token');
        
        // Import services dynamically to avoid circular dependencies
        const { hasPortalAccess, sendPortalInvite } = await import('./ghl-portal');
        const { documentStorage } = await import('./document-storage');
        const { sendDocumentRequest } = await import('./document-automation');
        const { db } = await import('../db');
        const { contacts, opportunities } = await import('@shared/schema');
        const { eq } = await import('drizzle-orm');
        
        try {
          // Check if contact already has portal access, if not send invite
          if (!await hasPortalAccess(contactId)) {
            await sendPortalInvite(contactId, 'lending');
            console.log(`✅ Portal invite sent to contact ${contactId} at DOCUMENTS_PENDING stage`);
          } else {
            console.log(`ℹ️ Contact ${contactId} already has portal access`);
          }
        } catch (error) {
          console.error('Failed to send portal invite at DOCUMENTS_PENDING:', error);
        }
        
        try {
          // Get contact and opportunity details
          const [contact] = await db.select().from(contacts).where(eq(contacts.ghlContactId, contactId));
          const [opportunity] = await db.select().from(opportunities).where(eq(opportunities.ghlOpportunityId, opportunityId));
          
          if (contact && opportunity) {
            const division = opportunity.division || 'lending';
            
            // Generate upload token
            const token = await documentStorage.generateUploadToken({
              contactId: contact.id,
              opportunityId: opportunity.id,
              division
            });
            
            const uploadUrl = `https://saintvisiongroup.com/upload/${token}`;
            
            // Send document request notification
            await sendDocumentRequest(contact.id, uploadUrl, division);
            
            console.log(`✅ Document upload token generated and sent to ${contact.email}`);
          }
        } catch (error) {
          console.error('Failed to generate document upload token:', error);
        }
      },
      [LENDING_PIPELINE_STAGES.FULL_APPLICATION_COMPLETE]: async () => {
        console.log('Trigger: Full application complete - notify client of review timeline + next steps');
      },
      [LENDING_PIPELINE_STAGES.SENT_TO_LENDER]: async () => {
        console.log('Trigger: Sent to lender - notify client of underwriting timeline (24-48hrs) + what to expect');
      },
      [LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING_FOLLOWUP]: async () => {
        console.log('Trigger: Additional documents requested - send specific requirements + urgent deadline notice');
      },
      [LENDING_PIPELINE_STAGES.SIGNATURE_QUALIFIED]: async () => {
        console.log('Trigger: Qualified for signature - send DocuSign link + congratulations message + funding timeline');
      },
      [LENDING_PIPELINE_STAGES.DISQUALIFIED]: async () => {
        console.log('Trigger: Disqualified - send empathetic message + alternative options + re-qualification timeline');
      },
      [LENDING_PIPELINE_STAGES.FUNDED]: async () => {
        console.log('Trigger: FUNDED! 💰 - send celebration message + fund receipt confirmation + request testimonial + referral bonus info');
      }
    };
    
    const automation = automations[newStage];
    if (automation) {
      await automation();
    } else {
      console.log(`No automation configured for stage: ${newStage}`);
    }
  } catch (error) {
    console.error('Stage progression automation failed:', error);
  }
}

async function sendAppointmentConfirmation(appointment: any) {
  console.log('Sending appointment confirmation for:', appointment.id);
  // TODO: Send SMS/Email confirmation
}

async function handleNoShow(contactId: string) {
  console.log('Handling no-show for contact:', contactId);
  // TODO: Trigger re-engagement workflow
}

export async function syncContactToGHL(contactData: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
}) {
  try {
    const GHL_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || process.env.GHL_API_KEY;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'NgUphdsMGXpRO3h98XyG';
    
    if (!GHL_TOKEN || !GHL_LOCATION_ID) {
      console.log('GHL sync skipped - API not configured');
      return { success: false, message: 'GHL not configured' };
    }

    const response = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        email: contactData.email,
        firstName: contactData.firstName || '',
        lastName: contactData.lastName || '',
        phone: contactData.phone || '',
        tags: contactData.tags || ['saintvision-platform']
      })
    });

    if (!response.ok) {
      throw new Error(`GHL Sync error: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, message: 'Contact synced to GHL', data: result };
  } catch (error) {
    console.error('GHL Contact Sync Error:', error);
    return { success: false, message: 'Contact sync failed', error: String(error) };
  }
}
