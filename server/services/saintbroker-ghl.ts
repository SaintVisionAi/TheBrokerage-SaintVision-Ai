import { 
  getContact, 
  searchContacts, 
  getOpportunitiesByContact,
  getPipelines,
  sendSMS,
  sendEmail 
} from './ghl-client';

// SaintBroker GHL Integration - Provides AI with full client file access

export interface ClientContext {
  contact?: any;
  opportunities?: any[];
  currentPipeline?: string;
  currentStage?: string;
  dealValue?: number;
  conversationSummary?: string;
}

/**
 * Search for a client by name, email, or phone
 */
export async function findClient(query: string): Promise<ClientContext | null> {
  try {
    // Try to search by various fields
    const contacts = await searchContacts(query);
    
    if (!contacts || contacts.length === 0) {
      return null;
    }

    // Get first matching contact
    const contact = contacts[0];
    
    // Get their opportunities (deals in pipeline)
    const opportunities = await getOpportunitiesByContact(contact.id);
    
    // Find active opportunity
    const activeOpportunity = opportunities?.find((opp: any) => opp.status === 'open');
    
    return {
      contact,
      opportunities,
      currentPipeline: activeOpportunity?.pipelineId || null,
      currentStage: activeOpportunity?.pipelineStage || null,
      dealValue: activeOpportunity?.monetaryValue || 0,
      conversationSummary: await getConversationSummary(contact.id)
    };
  } catch (error) {
    console.error('Error finding client:', error);
    return null;
  }
}

/**
 * Get full client context for AI
 */
export async function getClientContext(contactId: string): Promise<ClientContext> {
  try {
    const contact = await getContact(contactId);
    const opportunities = await getOpportunitiesByContact(contactId);
    
    const activeOpportunity = opportunities?.find((opp: any) => opp.status === 'open');
    
    return {
      contact,
      opportunities,
      currentPipeline: activeOpportunity?.pipelineId || null,
      currentStage: activeOpportunity?.pipelineStage || null,
      dealValue: activeOpportunity?.monetaryValue || 0,
      conversationSummary: await getConversationSummary(contactId)
    };
  } catch (error) {
    console.error('Error getting client context:', error);
    return {};
  }
}

/**
 * Format client context for AI prompt
 */
export function formatClientContextForAI(context: ClientContext): string {
  if (!context.contact) {
    return 'No client information available.';
  }

  const { contact, currentStage, dealValue, opportunities } = context;
  
  let contextString = `CLIENT FILE ACCESS:\n`;
  contextString += `Name: ${contact.firstName} ${contact.lastName}\n`;
  contextString += `Email: ${contact.email}\n`;
  contextString += `Phone: ${contact.phone || 'N/A'}\n`;
  
  if (currentStage) {
    contextString += `\nCURRENT PIPELINE STATUS:\n`;
    contextString += `Stage: ${currentStage}\n`;
    contextString += `Deal Value: $${dealValue?.toLocaleString() || 0}\n`;
  }
  
  if (opportunities && opportunities.length > 0) {
    contextString += `\nOPPORTUNITIES:\n`;
    opportunities.forEach((opp: any, i: number) => {
      contextString += `${i + 1}. ${opp.name} - ${opp.pipelineStage} ($${opp.monetaryValue?.toLocaleString() || 0})\n`;
    });
  }
  
  if (contact.customFields) {
    contextString += `\nADDITIONAL INFO:\n`;
    Object.entries(contact.customFields).forEach(([key, value]) => {
      if (value) {
        contextString += `${key}: ${value}\n`;
      }
    });
  }
  
  return contextString;
}

/**
 * Get conversation summary from GHL
 */
async function getConversationSummary(contactId: string): Promise<string> {
  // TODO: Implement conversation history retrieval
  return 'Conversation history not yet implemented';
}

/**
 * SaintBroker Actions - What the AI can DO with GHL
 */
export const saintBrokerActions = {
  
  /**
   * Send SMS to client
   */
  sendClientSMS: async (contactId: string, message: string) => {
    try {
      await sendSMS(contactId, message);
      return { success: true, message: 'SMS sent successfully' };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, message: 'Failed to send SMS' };
    }
  },
  
  /**
   * Send email to client
   */
  sendClientEmail: async (contactId: string, subject: string, body: string) => {
    try {
      await sendEmail(contactId, subject, body);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, message: 'Failed to send email' };
    }
  },
  
  /**
   * Get pipeline stages
   */
  getPipelineStages: async () => {
    try {
      const pipelines = await getPipelines();
      return pipelines;
    } catch (error) {
      console.error('Error getting pipelines:', error);
      return [];
    }
  },
  
  /**
   * Search for clients
   */
  searchClients: async (query: string) => {
    try {
      const clients = await searchContacts(query);
      return clients || [];
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  }
};

/**
 * Detect if message mentions a client and extract identifier
 */
export function detectClientMention(message: string): { 
  mentioned: boolean; 
  identifier?: string;
  type?: 'email' | 'phone' | 'name';
} {
  // Email pattern
  const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    return { mentioned: true, identifier: emailMatch[0], type: 'email' };
  }
  
  // Phone pattern (US format)
  const phoneMatch = message.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
  if (phoneMatch) {
    return { mentioned: true, identifier: phoneMatch[0], type: 'phone' };
  }
  
  // Name pattern (basic - can be enhanced)
  const nameKeywords = ['client', 'contact', 'customer', 'lead'];
  const hasNameKeyword = nameKeywords.some(kw => message.toLowerCase().includes(kw));
  
  if (hasNameKeyword) {
    // Try to extract name after keyword
    const namePattern = /(?:client|contact|customer|lead)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i;
    const nameMatch = message.match(namePattern);
    if (nameMatch) {
      return { mentioned: true, identifier: nameMatch[1], type: 'name' };
    }
  }
  
  return { mentioned: false };
}

/**
 * Main SaintBroker + GHL integration function
 */
export async function enhanceSaintBrokerWithGHL(userMessage: string): Promise<{
  hasClientContext: boolean;
  clientContext?: ClientContext;
  formattedContext?: string;
}> {
  const detection = detectClientMention(userMessage);
  
  if (!detection.mentioned || !detection.identifier) {
    return { hasClientContext: false };
  }
  
  const clientContext = await findClient(detection.identifier);
  
  if (!clientContext) {
    return { hasClientContext: false };
  }
  
  return {
    hasClientContext: true,
    clientContext,
    formattedContext: formatClientContextForAI(clientContext)
  };
}
