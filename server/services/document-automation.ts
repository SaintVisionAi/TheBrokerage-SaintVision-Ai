import { db } from '../db';
import { uploadTokens, opportunities, contacts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { sendTemplatedSMS } from './twilio-service';
import { EMAIL_CONFIG } from '../config/email';

/**
 * Check document completion and trigger stage advancement
 */
export async function checkDocumentCompletion(tokenId: string): Promise<boolean> {
  try {
    const [uploadToken] = await db
      .select()
      .from(uploadTokens)
      .where(eq(uploadTokens.id, tokenId));

    if (!uploadToken) {
      console.error('Upload token not found:', tokenId);
      return false;
    }

    const required = uploadToken.requiredDocuments || [];
    const uploaded = uploadToken.uploadedDocuments || [];

    const allUploaded = required.every(doc => uploaded.includes(doc));

    if (allUploaded && !uploadToken.completedAt) {
      // Mark token as completed
      await db
        .update(uploadTokens)
        .set({
          completedAt: new Date()
        })
        .where(eq(uploadTokens.id, tokenId));

      // Trigger stage advancement
      await advanceOpportunityStage(uploadToken.opportunityId!);

      // Send completion notification
      await sendDocumentCompletionNotification(uploadToken.contactId!);

      console.log(`✅ All documents completed for token ${tokenId}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking document completion:', error);
    return false;
  }
}

/**
 * Advance opportunity to next stage after document completion
 */
async function advanceOpportunityStage(opportunityId: string): Promise<void> {
  try {
    const [opportunity] = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.id, opportunityId));

    if (!opportunity) {
      console.error('Opportunity not found:', opportunityId);
      return;
    }

    // Define stage progression rules by division
    const stageProgression: Record<string, Record<string, string>> = {
      lending: {
        'Documents Pending': 'Full Application',
        'documents_pending': 'full_application'
      },
      investment: {
        'KYC/Accreditation': 'Account Setup',
        'kyc_accreditation': 'account_setup'
      },
      real_estate: {
        'KYC': 'Property Search',
        'kyc': 'property_search'
      }
    };

    const division = opportunity.division || '';
    const currentStage = opportunity.stageName || '';

    const nextStage = stageProgression[division]?.[currentStage] || 
                     stageProgression[division]?.[currentStage.toLowerCase().replace(/ /g, '_')];

    if (nextStage && opportunity.ghlOpportunityId) {
      // TODO: Update GHL opportunity stage when GHL client supports it
      // For now, just update local database
      
      // Update local database
      await db
        .update(opportunities)
        .set({
          stageName: nextStage,
          status: 'active',
          updatedAt: new Date()
        })
        .where(eq(opportunities.id, opportunityId));

      console.log(`📈 Advanced opportunity ${opportunityId} from ${currentStage} to ${nextStage}`);
    }
  } catch (error) {
    console.error('Error advancing opportunity stage:', error);
  }
}

/**
 * Send document completion notification to contact
 */
async function sendDocumentCompletionNotification(contactId: string): Promise<void> {
  try {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, contactId));

    if (!contact || !contact.phone) {
      console.error('Contact not found or has no phone:', contactId);
      return;
    }

    // Send SMS notification
    await sendTemplatedSMS(
      contact.phone,
      'Great news! All documents received. Moving to next step. Questions? Reply HELP.'
    );

    console.log(`📱 Sent completion SMS to ${contact.phone}`);
  } catch (error) {
    console.error('Error sending completion notification:', error);
  }
}

/**
 * Send document request notification when token is generated
 */
export async function sendDocumentRequest(
  contactId: string,
  uploadUrl: string,
  division: string
): Promise<void> {
  try {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, contactId));

    if (!contact) {
      console.error('Contact not found:', contactId);
      return;
    }

    const divisionName = division.charAt(0).toUpperCase() + division.slice(1);

    // Send SMS with upload link
    if (contact.phone) {
      const smsMessage = `Hi ${contact.firstName}! To move forward with your ${divisionName} application, we need a few documents. Please upload them here: ${uploadUrl}

Required documents will be listed. Reply HELP if you have questions!`;

      await sendTemplatedSMS(contact.phone, smsMessage);
      console.log(`📱 Sent document request SMS to ${contact.phone}`);
    }

    // TODO: Send email with upload link (implement when email service is ready)
    if (contact.email) {
      console.log(`📧 Email to ${contact.email}: ${uploadUrl} (email service pending)`);
    }
  } catch (error) {
    console.error('Error sending document request:', error);
  }
}

/**
 * Send reminder for pending documents
 */
export async function sendDocumentReminder(tokenId: string): Promise<void> {
  try {
    const [uploadToken] = await db
      .select()
      .from(uploadTokens)
      .where(eq(uploadTokens.id, tokenId));

    if (!uploadToken || uploadToken.completedAt) {
      return;
    }

    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, uploadToken.contactId!));

    if (!contact || !contact.phone) {
      return;
    }

    const required = uploadToken.requiredDocuments || [];
    const uploaded = uploadToken.uploadedDocuments || [];
    const pending = required.filter(doc => !uploaded.includes(doc));

    if (pending.length > 0 && contact.phone) {
      const uploadUrl = `https://saintvisiongroup.com/upload/${uploadToken.token}`;
      
      await sendTemplatedSMS(
        contact.phone,
        `Reminder: We still need ${pending.length} document(s) for your application. Upload here: ${uploadUrl} Reply HELP for assistance.`
      );

      console.log(`📱 Sent reminder SMS to ${contact.phone} for ${pending.length} pending documents`);
    }
  } catch (error) {
    console.error('Error sending document reminder:', error);
  }
}
