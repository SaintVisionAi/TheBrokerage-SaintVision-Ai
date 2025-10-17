// SMS Service using GHL (GoHighLevel) - No Twilio needed!
import type { Request, Response } from 'express';
import { sendSMS as ghlSendSMS, sendEmail as ghlSendEmail } from './ghl-client';

// Validate GHL is configured (we already have this from GHL client)
export function validateSMSConfig(): boolean {
  return !!(process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID);
}

// Format phone number to E.164 format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it's a 10-digit US number, add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // If it already has country code
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // If it starts with +, keep it
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Otherwise assume US and add +1
  return `+1${digits}`;
}

/**
 * Send SMS via GHL (GoHighLevel)
 */
export async function sendSMS(to: string, message: string): Promise<{
  success: boolean;
  messageSid?: string;
  error?: string;
}> {
  try {
    if (!validateSMSConfig()) {
      console.warn('GHL not configured - SMS not sent:', { to, message });
      return { success: false, error: 'GHL not configured' };
    }

    const formattedTo = formatPhoneNumber(to);
    
    // Use GHL SMS service
    const result = await ghlSendSMS(formattedTo, message);
    
    console.log('✅ SMS sent via GHL:', {
      to: formattedTo,
      success: result
    });
    
    return {
      success: result,
      messageSid: `ghl-${Date.now()}`
    };
  } catch (error: any) {
    console.error('❌ GHL SMS Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send bulk SMS (with rate limiting)
 */
export async function sendBulkSMS(messages: Array<{ to: string; message: string }>): Promise<{
  success: number;
  failed: number;
  results: Array<{ to: string; success: boolean; messageSid?: string; error?: string }>;
}> {
  const results = [];
  let success = 0;
  let failed = 0;
  
  for (const msg of messages) {
    const result = await sendSMS(msg.to, msg.message);
    results.push({ to: msg.to, ...result });
    
    if (result.success) {
      success++;
    } else {
      failed++;
    }
    
    // Rate limit: 1 message per 100ms (10 per second)
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return { success, failed, results };
}

/**
 * SMS Templates for automated messages
 */
export const SMS_TEMPLATES = {
  // Welcome messages by division
  welcome: {
    investment: (name: string, amount: string) => 
      `Hi ${name}! 🎉 Welcome to Saint Vision Group! We received your investment inquiry for $${amount}. Our team is reviewing it now. You'll hear from us within 24 hours. Reply with questions anytime!`,
    
    real_estate: (name: string, type: string) => 
      `Hi ${name}! 🏠 Welcome to Saint Vision Group! We received your ${type} inquiry. Our team will contact you within 24 hours to discuss your needs. Reply anytime!`,
    
    lending: (name: string, amount: string) => 
      `Hi ${name}! 💰 Welcome to Saint Vision Group! We received your loan application for $${amount}. Our lending team is reviewing it now. You'll receive an update within 24 hours. Reply with questions anytime!`
  },
  
  // Hot lead alert for agents
  hotLeadAlert: (name: string, amount: string, division: string) => 
    `🔥 HOT LEAD: ${name} - $${amount} - ${division.toUpperCase()}. Contact immediately!`,
  
  // Document requests
  documentRequest: (name: string, uploadLink: string) => 
    `Hi ${name}! To move forward with your application, we need a few documents. Please upload them here: ${uploadLink}\n\nRequired:\n• Government ID\n• Bank Statements\n• Additional docs\n\nReply HELP if you have questions!`,
  
  documentReceived: (name: string, docType: string) => 
    `Thanks ${name}! We received your ${docType}. ✅`,
  
  // Status updates
  statusUpdate: (name: string, stage: string) => 
    `Hi ${name}! Your application has moved to "${stage}" stage. We'll keep you updated! 🚀`,
  
  // Follow-ups
  noResponseFollowUp: (name: string, division: string) => 
    `Hi ${name}, just checking in! Did you have any questions about your ${division} inquiry? Reply YES to connect with our team.`,
  
  stageTimeoutFollowUp: (name: string, stage: string) => 
    `Hi ${name}, we noticed your application is in "${stage}". Need help moving forward? Reply YES and we'll assist!`,
  
  // Callbacks
  callbackConfirmation: (name: string) => 
    `Got it ${name}! An agent will call you shortly. 📞`,
  
  // Upload reminders
  uploadReminder: (name: string, uploadLink: string) => 
    `Hi ${name}! Friendly reminder: We're still waiting for your documents. Upload here: ${uploadLink}`,
  
  // Funded/Success
  fundedCelebration: (name: string, amount: string) => 
    `🎉 Congratulations ${name}! Your loan for $${amount} has been FUNDED! Funds will arrive in 3-5 business days. Thank you for choosing Saint Vision Group! 💰`
};

/**
 * Handle incoming SMS webhook from Twilio
 */
export async function handleIncomingSMS(req: Request, res: Response) {
  try {
    const { From, To, Body, MessageSid } = req.body;
    
    console.log('📱 Incoming SMS:', {
      from: From,
      to: To,
      body: Body,
      messageSid: MessageSid
    });
    
    // Acknowledge receipt immediately (Twilio expects 200 within 15 seconds)
    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
    
    // Process SMS asynchronously
    processSMS(From, Body, MessageSid).catch(error => {
      console.error('SMS processing error:', error);
    });
    
  } catch (error) {
    console.error('Incoming SMS handler error:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  }
}

/**
 * Process incoming SMS with intent detection
 */
async function processSMS(from: string, message: string, messageSid: string) {
  try {
    const lowerMessage = message.toLowerCase().trim();
    
    // TODO: Find contact by phone in GHL
    // const contact = await findContactByPhone(from);
    
    // Keyword detection and routing
    if (lowerMessage.includes('status') || lowerMessage.includes('update')) {
      // TODO: Get status from GHL and respond
      await sendSMS(from, "Let me check your status...");
    }
    else if (lowerMessage.includes('document') || lowerMessage.includes('upload')) {
      // TODO: Generate upload link and send
      await sendSMS(from, "I'll send you an upload link...");
    }
    else if (lowerMessage.includes('help') || lowerMessage.includes('agent') || lowerMessage.includes('call')) {
      // TODO: Create callback task
      await sendSMS(from, "I'll have an agent call you! When's a good time? Reply: 1) Now, 2) This afternoon, 3) Tomorrow");
    }
    else if (lowerMessage === 'yes' || lowerMessage === 'y') {
      await sendSMS(from, "Great! An agent will reach out shortly. 👍");
    }
    else if (lowerMessage === 'stop' || lowerMessage === 'unsubscribe') {
      // TODO: Mark as unsubscribed in GHL
      await sendSMS(from, "You've been unsubscribed. Reply START to resubscribe.");
    }
    else if (lowerMessage === 'start' || lowerMessage === 'subscribe') {
      // TODO: Mark as subscribed in GHL
      await sendSMS(from, "Welcome back! You're subscribed to updates from Saint Vision Group. 🙏");
    }
    else {
      // TODO: Send to AI for response
      await sendSMS(from, "Thanks for your message! An agent will respond shortly. For immediate help, call (800) 555-LOAN");
    }
    
  } catch (error) {
    console.error('SMS processing error:', error);
  }
}

/**
 * Send SMS with template
 */
export async function sendTemplatedSMS(
  to: string, 
  template: keyof typeof SMS_TEMPLATES, 
  params: any
): Promise<{ success: boolean; messageSid?: string; error?: string }> {
  
  const templateFn = SMS_TEMPLATES[template];
  
  if (!templateFn) {
    return { success: false, error: 'Template not found' };
  }
  
  let message: string;
  
  // Handle different template types
  if (template === 'welcome') {
    const { division, name, amount } = params;
    message = (templateFn as any)[division](name, amount);
  } else if (typeof templateFn === 'function') {
    message = (templateFn as any)(...Object.values(params));
  } else {
    return { success: false, error: 'Invalid template' };
  }
  
  return await sendSMS(to, message);
}

// Voice call capabilities (future enhancement - can be added via GHL or other service)
export async function makeCall(to: string, message: string) {
  console.log('📞 Voice calls - Future enhancement via GHL or Azure Speech', { to, message });
  return { success: false, error: 'Voice calls not yet implemented' };
}
