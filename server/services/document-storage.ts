// ⚠️ WARNING: Files stored locally - migrate to S3/Azure Blob for production
// Current storage is ephemeral and will be lost on restart
// For production: Use cloud storage (AWS S3, Azure Blob, or Replit Object Storage)

import { db } from '../db';
import { documents, uploadTokens, contacts, opportunities } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { getRequiredDocuments, validateFileType } from '../config/document-requirements';
import { updateContact as updateGHLContact } from './ghl-client';
import { checkDocumentCompletion } from './document-automation';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const TOKEN_EXPIRY_DAYS = 30;

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export interface UploadTokenData {
  contactId: string;
  opportunityId: string;
  division: string;
}

export class DocumentStorageService {
  /**
   * Generate a secure upload token for a contact/opportunity
   */
  async generateUploadToken(data: UploadTokenData): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS);

    const requiredDocs = getRequiredDocuments(data.division);
    const requiredDocTypes = requiredDocs.map(doc => doc.type);

    await db.insert(uploadTokens).values({
      token,
      contactId: data.contactId,
      opportunityId: data.opportunityId,
      division: data.division,
      requiredDocuments: requiredDocTypes,
      expiresAt,
      used: false
    });

    return token;
  }

  /**
   * Validate an upload token
   */
  async validateToken(token: string) {
    const [uploadToken] = await db
      .select()
      .from(uploadTokens)
      .where(eq(uploadTokens.token, token));

    if (!uploadToken) {
      throw new Error('Invalid upload token');
    }

    if (uploadToken.expiresAt && new Date() > uploadToken.expiresAt) {
      throw new Error('Upload token has expired');
    }

    if (uploadToken.completedAt) {
      throw new Error('Upload token has already been completed');
    }

    return uploadToken;
  }

  /**
   * Get token details with contact and opportunity info
   */
  async getTokenDetails(token: string) {
    const uploadToken = await this.validateToken(token);

    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, uploadToken.contactId!));

    const [opportunity] = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.id, uploadToken.opportunityId!));

    return {
      uploadToken,
      contact,
      opportunity,
      requiredDocuments: getRequiredDocuments(uploadToken.division!)
    };
  }

  /**
   * Store uploaded document
   */
  async storeDocument(
    token: string,
    file: {
      filename: string;
      mimeType: string;
      size: number;
      buffer: Buffer;
    },
    documentType: string
  ) {
    try {
      const uploadToken = await this.validateToken(token);

      // Validate file type
      if (!validateFileType(uploadToken.division!, documentType, file.mimeType)) {
        throw new Error(`Invalid file type for ${documentType}. Accepted formats: ${getRequiredDocuments(uploadToken.division!).find(d => d.type === documentType)?.acceptedFormats.join(', ')}`);
      }

      // Ensure upload directory exists
      await ensureUploadDir();

      // Generate unique filename
      const fileExtension = path.extname(file.filename);
      const uniqueFilename = `${uploadToken.id}_${documentType}_${Date.now()}${fileExtension}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFilename);

      // Save file to disk
      await fs.writeFile(filePath, file.buffer);
      
      console.warn('⚠️ Document stored locally - consider migrating to cloud storage for production');

      // Create document record
      const [document] = await db.insert(documents).values({
        contactId: uploadToken.contactId,
        opportunityId: uploadToken.opportunityId,
        uploadTokenId: uploadToken.id,
        filename: file.filename,
        fileType: file.mimeType,
        fileSize: file.size,
        fileUrl: `/uploads/${uniqueFilename}`,
        division: uploadToken.division,
        documentType,
        status: 'pending'
      }).returning();

      // Update upload token's uploaded documents list
      const currentUploaded = uploadToken.uploadedDocuments || [];
      if (!currentUploaded.includes(documentType)) {
        await db
          .update(uploadTokens)
          .set({
            uploadedDocuments: [...currentUploaded, documentType]
          })
          .where(eq(uploadTokens.id, uploadToken.id));
      }

      // Check if all documents are uploaded and trigger automation
      const isComplete = await this.checkCompletionStatus(uploadToken.id);
      
      if (isComplete) {
        await checkDocumentCompletion(uploadToken.id);
      }

      // Update GHL custom field
      if (uploadToken.contactId) {
        const [contact] = await db
          .select()
          .from(contacts)
          .where(eq(contacts.id, uploadToken.contactId));
          
        if (contact?.ghlContactId) {
          try {
            await updateGHLContact(contact.ghlContactId, {
              customField: {
                [`doc_${documentType}_uploaded`]: 'true'
              }
            });
          } catch (error) {
            console.error('Failed to update GHL contact:', error);
          }
        }
      }

      return document;
    } catch (error: any) {
      console.error('Document upload failed:', error);
      throw error;
    }
  }

  /**
   * Check if all required documents are uploaded and mark token as complete
   */
  async checkCompletionStatus(tokenId: string) {
    const [uploadToken] = await db
      .select()
      .from(uploadTokens)
      .where(eq(uploadTokens.id, tokenId));

    if (!uploadToken) return false;

    const required = uploadToken.requiredDocuments || [];
    const uploaded = uploadToken.uploadedDocuments || [];

    const allUploaded = required.every(doc => uploaded.includes(doc));

    if (allUploaded && !uploadToken.completedAt) {
      await db
        .update(uploadTokens)
        .set({
          completedAt: new Date()
        })
        .where(eq(uploadTokens.id, tokenId));

      return true;
    }

    return false;
  }

  /**
   * Get all documents for an upload token
   */
  async getDocumentsByToken(tokenId: string) {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.uploadTokenId, tokenId));
  }

  /**
   * Get all documents for a contact
   */
  async getDocumentsByContact(contactId: string) {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.contactId, contactId));
  }

  /**
   * Get upload progress for a token
   */
  async getUploadProgress(token: string) {
    const uploadToken = await this.validateToken(token);
    const required = uploadToken.requiredDocuments || [];
    const uploaded = uploadToken.uploadedDocuments || [];

    return {
      total: required.length,
      completed: uploaded.length,
      percentage: required.length > 0 ? Math.round((uploaded.length / required.length) * 100) : 0,
      required,
      uploaded,
      remaining: required.filter(doc => !uploaded.includes(doc))
    };
  }
}

export const documentStorage = new DocumentStorageService();
