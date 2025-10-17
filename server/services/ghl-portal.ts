import { sendSMS } from './twilio-service';
import { EMAIL_CONFIG } from '../config/email';

/**
 * GHL Client Portal Integration Service
 * Handles magic link generation, portal invites, and access management
 */

/**
 * Generate GHL Client Portal Magic Link
 * This calls GHL API to generate a magic link for client portal access
 */
export async function generatePortalMagicLink(contactId: string): Promise<string> {
  const GHL_API_KEY = process.env.GHL_API_KEY;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
  
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    throw new Error('GHL API not configured. Please set GHL_API_KEY and GHL_LOCATION_ID environment variables.');
  }
  
  try {
    // GHL API endpoint for portal access
    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/portal-access`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        generateLink: true
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GHL Portal Link Generation Failed: ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    const magicLink = result.magicLink || result.portalUrl || result.url;
    
    if (!magicLink) {
      throw new Error('GHL API did not return a magic link');
    }
    
    console.log(`✅ Magic link generated for contact ${contactId}`);
    return magicLink;
  } catch (error) {
    console.error('GHL Portal Link Generation Error:', error);
    throw error;
  }
}

/**
 * Send Client Portal Invite via SMS/Email
 */
export async function sendPortalInvite(
  contactId: string, 
  division: 'lending' | 'investment' | 'real_estate'
): Promise<{ success: boolean; magicLink: string }> {
  const { db } = await import('../db');
  const { contacts, systemLogs } = await import('@shared/schema');
  const { eq } = await import('drizzle-orm');
  
  try {
    // Get contact info
    const [contact] = await db.select().from(contacts).where(eq(contacts.ghlContactId, contactId));
    
    if (!contact) {
      throw new Error(`Contact not found with GHL ID: ${contactId}`);
    }
    
    // Generate magic link
    const magicLink = await generatePortalMagicLink(contactId);
    
    // Send SMS with portal link
    const smsTemplates = {
      lending: `Hi ${contact.firstName}! 🏦 Access your loan application portal here: ${magicLink}\n\nView status, upload documents, and message our team anytime. - Saint Vision Group`,
      investment: `Hi ${contact.firstName}! 💼 Your investment portal is ready: ${magicLink}\n\nTrack deals, view documents, and stay updated. - Saint Vision Group`,
      real_estate: `Hi ${contact.firstName}! 🏠 Access your property portal here: ${magicLink}\n\nView listings, upload docs, and connect with your agent. - Saint Vision Group`
    };
    
    const smsMessage = smsTemplates[division];
    
    if (contact.phone) {
      await sendSMS(contact.phone, smsMessage);
      console.log(`✅ Portal invite SMS sent to ${contact.phone}`);
    } else {
      console.warn(`⚠️ No phone number for contact ${contactId}, skipping SMS`);
    }
    
    // Send Email via GHL (they handle it)
    await triggerGHLPortalEmail(contactId);
    
    // Log the portal invite
    await db.insert(systemLogs).values({
      userId: contact.id,
      action: 'portal_invite_sent',
      details: {
        contactId,
        division,
        magicLink,
        timestamp: new Date().toISOString()
      }
    });
    
    console.log(`✅ Portal invite sent to ${contact.email} (${division})`);
    
    return { success: true, magicLink };
  } catch (error: any) {
    console.error('Portal invite error:', error);
    throw new Error(`Failed to send portal invite: ${error.message}`);
  }
}

/**
 * Trigger GHL's built-in portal invitation email
 */
async function triggerGHLPortalEmail(contactId: string): Promise<void> {
  const GHL_API_KEY = process.env.GHL_API_KEY;
  
  if (!GHL_API_KEY) {
    console.warn('GHL API not configured - portal email not sent');
    return;
  }
  
  try {
    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/portal/invite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    });
    
    if (!response.ok) {
      console.warn(`GHL portal email trigger failed: ${response.statusText}`);
    } else {
      console.log(`✅ GHL portal invitation email triggered for contact ${contactId}`);
    }
  } catch (error) {
    console.error('GHL portal email trigger error:', error);
  }
}

/**
 * Check if contact has portal access
 */
export async function hasPortalAccess(contactId: string): Promise<boolean> {
  const GHL_API_KEY = process.env.GHL_API_KEY;
  
  if (!GHL_API_KEY) {
    console.warn('GHL API not configured - cannot check portal access');
    return false;
  }
  
  try {
    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/portal-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Version': '2021-07-28'
      }
    });
    
    if (!response.ok) {
      console.warn(`GHL portal status check failed: ${response.statusText}`);
      return false;
    }
    
    const result = await response.json();
    const hasAccess = result.hasAccess || result.portalEnabled || result.isActive || false;
    
    console.log(`Portal access check for ${contactId}: ${hasAccess}`);
    return hasAccess;
  } catch (error) {
    console.error('Portal access check error:', error);
    return false;
  }
}

/**
 * Revoke portal access for a contact
 */
export async function revokePortalAccess(contactId: string): Promise<boolean> {
  const GHL_API_KEY = process.env.GHL_API_KEY;
  
  if (!GHL_API_KEY) {
    throw new Error('GHL API not configured');
  }
  
  try {
    const response = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}/portal-access`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Version': '2021-07-28'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to revoke portal access: ${response.statusText}`);
    }
    
    console.log(`✅ Portal access revoked for contact ${contactId}`);
    return true;
  } catch (error) {
    console.error('Revoke portal access error:', error);
    throw error;
  }
}

/**
 * Handle portal login event (called from webhook)
 */
export async function handlePortalLogin(data: {
  contactId: string;
  loginTime: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  const { db } = await import('../db');
  const { systemLogs } = await import('@shared/schema');
  
  try {
    await db.insert(systemLogs).values({
      userId: data.contactId,
      action: 'portal_login',
      details: {
        timestamp: data.loginTime,
        ip: data.ipAddress,
        userAgent: data.userAgent
      }
    });
    
    console.log(`📊 Portal login logged for contact ${data.contactId}`);
  } catch (error) {
    console.error('Failed to log portal login:', error);
  }
}

/**
 * Handle portal document upload event (called from webhook)
 */
export async function handlePortalDocumentUpload(data: {
  contactId: string;
  documentId: string;
  documentName: string;
  documentUrl: string;
  uploadTime: string;
}): Promise<void> {
  const { db } = await import('../db');
  const { systemLogs, documents } = await import('@shared/schema');
  
  try {
    // Log the upload event
    await db.insert(systemLogs).values({
      userId: data.contactId,
      action: 'portal_document_upload',
      details: {
        documentId: data.documentId,
        documentName: data.documentName,
        documentUrl: data.documentUrl,
        timestamp: data.uploadTime
      }
    });
    
    console.log(`📄 Portal document upload logged: ${data.documentName} from contact ${data.contactId}`);
    
    // TODO: Sync document to our document system if needed
    // This would create a record in the documents table
  } catch (error) {
    console.error('Failed to log portal document upload:', error);
  }
}
