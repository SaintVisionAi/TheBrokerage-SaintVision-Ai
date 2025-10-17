/**
 * 🔥 SAINTBROKER + GHL INTEGRATION CLIENT
 * Complete GoHighLevel API Client with full pipeline automation
 */

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// CRITICAL: Validate environment variables at startup
if (!GHL_API_KEY) {
  console.error('❌ GHL_API_KEY environment variable is not set!');
}

if (!GHL_LOCATION_ID) {
  console.error('❌ GHL_LOCATION_ID environment variable is not set!');
}

function getHeaders() {
  if (!GHL_API_KEY) {
    throw new Error('GHL_API_KEY is not configured. Please set the environment variable.');
  }
  
  return {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };
}

function validateGHLConfig() {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    throw new Error('GHL integration not configured. Please set GHL_API_KEY and GHL_LOCATION_ID environment variables.');
  }
}

// ==================== CONTACTS API ====================

export interface GHLContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  source?: string;
  tags?: string[];
  customFields?: Array<{ key: string; field_value: string }>;
}

export async function createContact(contactData: GHLContactData) {
  validateGHLConfig();
  
  const response = await fetch(`${GHL_API_BASE}/contacts/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone,
      address1: contactData.address,
      city: contactData.city,
      state: contactData.state,
      postalCode: contactData.zip,
      source: contactData.source || 'Website - SaintBroker AI',
      tags: contactData.tags || ['new-lead'],
      customFields: contactData.customFields || []
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GHL Contact Creation Failed: ${error}`);
  }

  const result = await response.json();
  return result.contact;
}

export async function getContact(contactId: string) {
  validateGHLConfig();
  
  const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`GHL Get Contact Failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.contact;
}

export async function updateContact(contactId: string, updates: Partial<GHLContactData>) {
  validateGHLConfig();
  
  const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      ...updates
    })
  });

  if (!response.ok) {
    throw new Error(`GHL Update Contact Failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.contact;
}

export async function searchContacts(query: string) {
  validateGHLConfig();
  
  const params = new URLSearchParams({
    locationId: GHL_LOCATION_ID!,
    query: query
  });

  const response = await fetch(`${GHL_API_BASE}/contacts/?${params}`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`GHL Search Contacts Failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.contacts;
}

export async function getContactByEmail(email: string) {
  const contacts = await searchContacts(email);
  return contacts.find((c: any) => c.email === email);
}

// ==================== OPPORTUNITIES API (Pipeline/Deals) ====================

export interface GHLOpportunityData {
  dealName: string;
  pipelineId: string;
  stageId: string;
  contactId: string;
  monetaryValue?: number;
  assignedTo?: string;
  customFields?: Array<{ key: string; value: string }>;
}

export async function createOpportunity(opportunityData: GHLOpportunityData) {
  validateGHLConfig();
  
  const response = await fetch(`${GHL_API_BASE}/opportunities/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      name: opportunityData.dealName,
      pipelineId: opportunityData.pipelineId,
      pipelineStageId: opportunityData.stageId,
      contactId: opportunityData.contactId,
      status: 'open',
      monetaryValue: opportunityData.monetaryValue,
      assignedTo: opportunityData.assignedTo,
      source: 'SaintBroker AI',
      customFields: opportunityData.customFields || []
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GHL Opportunity Creation Failed: ${error}`);
  }

  const result = await response.json();
  return result.opportunity;
}

export async function moveOpportunityStage(opportunityId: string, newStageId: string) {
  validateGHLConfig();
  
  const response = await fetch(`${GHL_API_BASE}/opportunities/${opportunityId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      pipelineStageId: newStageId
    })
  });

  if (!response.ok) {
    throw new Error(`GHL Move Opportunity Failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.opportunity;
}

export async function getPipelines() {
  validateGHLConfig();
  
  const params = new URLSearchParams({
    locationId: GHL_LOCATION_ID!
  });

  const response = await fetch(`${GHL_API_BASE}/opportunities/pipelines?${params}`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`GHL Get Pipelines Failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.pipelines;
}

export async function getOpportunitiesByContact(contactId: string) {
  validateGHLConfig();
  
  const params = new URLSearchParams({
    locationId: GHL_LOCATION_ID!,
    contactId: contactId
  });

  const response = await fetch(`${GHL_API_BASE}/opportunities/?${params}`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`GHL Get Opportunities Failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.opportunities;
}

// ==================== CALENDAR API ====================

export interface GHLAppointmentData {
  calendarId: string;
  contactId: string;
  startTime: string; // ISO 8601 format
  endTime: string;
  title: string;
  agentId?: string;
}

export async function createAppointment(appointmentData: GHLAppointmentData) {
  validateGHLConfig();
  
  const response = await fetch(`${GHL_API_BASE}/calendars/events/appointments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      calendarId: appointmentData.calendarId,
      contactId: appointmentData.contactId,
      startTime: appointmentData.startTime,
      endTime: appointmentData.endTime,
      title: appointmentData.title,
      appointmentStatus: 'confirmed',
      assignedUserId: appointmentData.agentId
    })
  });

  if (!response.ok) {
    throw new Error(`GHL Create Appointment Failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.appointment;
}

// ==================== WORKFLOWS API ====================

export async function triggerWorkflow(contactId: string, workflowId: string) {
  validateGHLConfig();
  
  const response = await fetch(
    `${GHL_API_BASE}/contacts/${contactId}/workflow/${workflowId}`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID
      })
    }
  );

  if (!response.ok) {
    throw new Error(`GHL Trigger Workflow Failed: ${response.statusText}`);
  }

  return response.ok;
}

// ==================== CONVERSATIONS API (SMS/Email) ====================

export async function sendSMS(contactId: string, message: string) {
  validateGHLConfig();
  
  const response = await fetch(`${GHL_API_BASE}/conversations/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      type: 'SMS',
      contactId: contactId,
      message: message
    })
  });

  if (!response.ok) {
    throw new Error(`GHL Send SMS Failed: ${response.statusText}`);
  }

  return response.ok;
}

export async function sendEmail(contactId: string, subject: string, htmlBody: string) {
  validateGHLConfig();
  
  const response = await fetch(`${GHL_API_BASE}/conversations/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      type: 'Email',
      contactId: contactId,
      subject: subject,
      html: htmlBody
    })
  });

  if (!response.ok) {
    throw new Error(`GHL Send Email Failed: ${response.statusText}`);
  }

  return response.ok;
}

// ==================== SAINTBROKER ORCHESTRATION ====================

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service: 'lending' | 'real-estate' | 'investments';
  loanAmount?: string;
  propertyAddress?: string;
  creditScore?: string;
  source?: string;
}

export async function processNewLead(leadData: LeadData) {
  try {
    // 1. Create GHL Contact
    const contact = await createContact({
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      source: leadData.source || 'Website Pre-Qual Form',
      tags: ['pre-qual', leadData.service, 'saintbroker-ai'],
      customFields: [
        { key: 'loan_amount', field_value: leadData.loanAmount || '' },
        { key: 'credit_score', field_value: leadData.creditScore || '' },
        { key: 'service_type', field_value: leadData.service }
      ]
    });

    // 2. Get pipelines and determine correct one
    const pipelines = await getPipelines();
    const servicePipeline = pipelines.find((p: any) => 
      p.name.toLowerCase().includes(leadData.service.toLowerCase())
    );

    if (!servicePipeline) {
      console.warn(`No pipeline found for service: ${leadData.service}`);
      return { contact, opportunity: null };
    }

    // 3. Create Opportunity in first stage
    const firstStage = servicePipeline.stages[0];
    const opportunity = await createOpportunity({
      dealName: `${leadData.firstName} ${leadData.lastName} - ${leadData.service}`,
      pipelineId: servicePipeline.id,
      stageId: firstStage.id,
      contactId: contact.id,
      monetaryValue: leadData.loanAmount ? parseInt(leadData.loanAmount.replace(/\D/g, '')) : 0,
      customFields: [
        { key: 'property_address', value: leadData.propertyAddress || '' },
        { key: 'credit_score', value: leadData.creditScore || '' }
      ]
    });

    // 4. Send welcome SMS
    if (contact.phone) {
      await sendSMS(
        contact.id,
        `Hi ${leadData.firstName}! Welcome to Saint Vision Group! I'm SaintBroker, your AI assistant. We received your inquiry and will contact you within 24 hours. Reply anytime with questions! 🚀`
      );
    }

    // 5. Trigger welcome workflow if configured
    const welcomeWorkflowId = process.env.GHL_WELCOME_WORKFLOW_ID;
    if (welcomeWorkflowId) {
      await triggerWorkflow(contact.id, welcomeWorkflowId);
    }

    return { contact, opportunity };
  } catch (error: any) {
    console.error('GHL Lead Processing Error:', error.message);
    throw error;
  }
}

// ==================== HEALTH CHECK ====================

export async function checkGHLConnection() {
  try {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      return { connected: false, error: 'Missing API credentials' };
    }

    const pipelines = await getPipelines();
    return {
      connected: true,
      location: GHL_LOCATION_ID,
      pipelineCount: pipelines.length
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error.message
    };
  }
}
