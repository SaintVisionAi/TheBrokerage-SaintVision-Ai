import express, { Router, Request, Response } from 'express';
import { saintSal } from '../lib/saintvision-ai-core';
import { storage } from '../storage';
import { captureGHLLead } from '../services/ghl';
import crypto from 'crypto';
import { hashPassword } from '../lib/password';
import { createSession } from '../lib/session';

const router = Router();

// API Key validation middleware
function requireApiKey(req: Request, res: Response, next: Function) {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.INTERNAL_API_KEY || 'saintvision_internal_2025_secure';

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid or missing API key'
    });
  }

  next();
}

/**
 * POST /api/saintsal/chat
 * Chat with SaintSal AI
 * 
 * Headers: x-api-key
 * Body: { userId, message, conversationId?, metadata? }
 */
router.post('/saintsal/chat', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { userId, message, conversationId, metadata } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'userId and message are required'
      });
    }

    console.log(`💬 SaintSal Chat - User: ${userId}, Message: ${message.substring(0, 50)}...`);

    // Call SaintSal AI
    const aiResponse = await saintSal.chat(userId, message);

    // Log the conversation if conversationId provided
    if (conversationId) {
      try {
        await storage.createMessage({
          conversationId,
          role: 'user',
          content: message,
          metadata
        });

        await storage.createMessage({
          conversationId,
          role: 'assistant',
          content: aiResponse.response,
          metadata: {
            model: aiResponse.model,
            latencyMs: aiResponse.latencyMs,
            tokensUsed: aiResponse.tokensUsed,
            analysis: aiResponse.analysis
          }
        });

        console.log(`✅ Conversation logged for ${conversationId}`);
      } catch (error) {
        console.warn('⚠️ Failed to log conversation:', error);
        // Continue - don't fail the response
      }
    }

    res.json({
      success: true,
      ...aiResponse
    });
  } catch (error: any) {
    console.error('❌ SaintSal Chat Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat'
    });
  }
});

/**
 * POST /api/saintsal/apply
 * Submit application to SaintSal
 * 
 * Headers: x-api-key
 * Body: { name, email, phone, loanType, loanAmount, purpose, ... }
 */
router.post('/saintsal/apply', requireApiKey, async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      loanType,
      loanAmount,
      purpose,
      creditScore,
      businessName,
      businessRevenue,
      timeInBusiness,
      downPaymentAvailable
    } = req.body;

    if (!name || !email || !loanAmount) {
      return res.status(400).json({
        success: false,
        error: 'name, email, and loanAmount are required'
      });
    }

    console.log(`📝 SaintSal Apply - ${name} (${email}) - $${loanAmount} ${loanType || 'loan'}`);

    const firstName = name.split(' ')[0];
    const lastName = name.split(' ').slice(1).join(' ') || 'Applicant';

    // Capture to GHL
    const ghlResponse = await captureGHLLead({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      service: (loanType === 'real-estate' ? 'real-estate' : 'lending') as any,
      type: loanType || 'business-loan',
      notes: `Application via SaintSal API\nPurpose: ${purpose || 'Not specified'}\nCredit Score: ${creditScore || 'Not provided'}\nBusiness Revenue: ${businessRevenue || 'Not provided'}\nTime in Business: ${timeInBusiness || 'Not provided'}`,
      source: 'saintsal-api'
    });

    const ghlContactId = (ghlResponse as any).contact?.id || (ghlResponse as any).data?.contact?.id || '';

    // Create application record
    const applicationId = crypto.randomBytes(8).toString('hex');

    // Save to database
    try {
      const { db } = await import('../db');
      const { applications, contacts } = await import('@shared/schema');

      // First, ensure contact exists in database
      await db.insert(contacts).values({
        ghlContactId: ghlContactId || null,
        firstName,
        lastName,
        email,
        phone: phone || null,
        source: 'saintsal-api',
        tags: ['saintsal', loanType || 'lending'],
        customFields: {
          businessName,
          businessRevenue,
          timeInBusiness,
          downPaymentAvailable
        }
      }).onConflictDoUpdate({
        target: contacts.email,
        set: {
          phone: phone || null,
          tags: ['saintsal', loanType || 'lending'],
          customFields: {
            businessName,
            businessRevenue,
            timeInBusiness,
            downPaymentAvailable
          }
        }
      });

      // Create application record
      await db.insert(applications).values({
        applicationId,
        email,
        firstName,
        lastName,
        loanType: loanType || 'business-loan',
        loanAmount: parseInt(loanAmount),
        purpose,
        creditScore: creditScore ? parseInt(creditScore) : null,
        businessName: businessName || null,
        businessRevenue: businessRevenue ? parseInt(businessRevenue) : null,
        timeInBusiness: timeInBusiness || null,
        downPaymentAvailable: downPaymentAvailable || null,
        status: 'pending',
        stage: 'pre-qualification',
        ghlContactId: ghlContactId || null
      });

      console.log(`✅ Application saved: ${applicationId}`);
    } catch (dbError) {
      console.warn('⚠️ Database save failed:', dbError);
      // Continue - don't fail the response
    }

    res.json({
      success: true,
      applicationId,
      ghlContactId,
      status: 'pending',
      stage: 'pre-qualification',
      message: 'Application submitted successfully! Our team will contact you within 24-48 hours.',
      nextSteps: [
        'Check your email for application confirmation',
        'Prepare business documents (tax returns, bank statements)',
        'Expect a call from our lending team within 24 hours',
        'Review your pre-approval terms'
      ]
    });
  } catch (error: any) {
    console.error('❌ SaintSal Apply Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit application'
    });
  }
});

/**
 * GET /api/saintsal/status
 * Check application status
 * 
 * Headers: x-api-key
 * Query: ?email=user@example.com
 */
router.get('/saintsal/status', requireApiKey, async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'email query parameter is required'
      });
    }

    console.log(`📊 SaintSal Status - ${email}`);

    // Get user from database
    const user = await storage.getUserByEmail(email as string);

    if (!user) {
      return res.json({
        success: true,
        user: null,
        applications: [],
        message: 'No user found with this email'
      });
    }

    // Get applications from database
    try {
      const { db } = await import('../db');
      const { applications } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');

      const userApplications = await db
        .select()
        .from(applications)
        .where(eq(applications.email, email as string));

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        applications: userApplications.map(app => ({
          id: app.id,
          applicationId: app.applicationId,
          loanType: app.loanType,
          loanAmount: app.loanAmount,
          status: app.status,
          stage: app.stage,
          purpose: app.purpose,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt
        })),
        count: userApplications.length
      });
    } catch (dbError) {
      console.warn('⚠️ Database query failed:', dbError);
      // Return user info even if database fails
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        },
        applications: [],
        message: 'Could not retrieve applications at this time'
      });
    }
  } catch (error: any) {
    console.error('❌ SaintSal Status Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check status'
    });
  }
});

/**
 * GET /api/saintsal/health
 * Health check endpoint
 */
router.get('/saintsal/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'SaintSal AI',
    endpoints: [
      'POST /api/saintsal/chat',
      'POST /api/saintsal/apply',
      'GET /api/saintsal/status'
    ]
  });
});

/**
 * POST /api/saintsal/sms
 * Handle incoming SMS from Twilio
 */
router.post('/saintsal/sms', async (req: Request, res: Response) => {
  try {
    const { From, Body } = req.body;

    if (!From || !Body) {
      return res.status(400).json({
        success: false,
        error: 'From and Body are required'
      });
    }

    console.log(`📱 SaintSal SMS - From: ${From}, Message: ${Body.substring(0, 50)}...`);

    // Call SaintSal (using phone as userId)
    const aiResponse = await saintSal.chat(From, Body);

    // Format response for Twilio
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>${aiResponse.response}</Message>
      </Response>`;

    res.type('text/xml').send(twiml);
  } catch (error: any) {
    console.error('❌ SaintSal SMS Error:', error);

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>Thank you for reaching out. Please call us at (949) 997-2097 or visit saintvisionai.com. We're here to help!</Message>
      </Response>`;

    res.type('text/xml').send(twiml);
  }
});

export default router;
