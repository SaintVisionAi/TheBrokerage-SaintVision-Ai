import { Router, Request, Response } from 'express';
import { db } from '../db';
import { applications, contacts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { captureGHLLead } from '../services/ghl';
import { sendSMS } from '../services/twilio-service';
import { FUNDING_PARTNERS, autoSelectFundingPartner } from '@shared/funding-partners-ai';

const router = Router();

// ============= PIPELINE AUTOMATION ROUTES =============

/**
 * POST /api/pipeline/credit-pull
 * Stage 2: Credit Pull
 * Collect SSN/DOB, pull credit report, save credit score
 */
router.post('/pipeline/credit-pull', async (req: Request, res: Response) => {
  try {
    const { applicationId, ssn, dob, address, city, state, zip } = req.body;

    if (!applicationId || !ssn || !dob) {
      return res.status(400).json({ error: 'applicationId, ssn, and dob required' });
    }

    // Get application
    const app = await db.query.applications.findFirst({
      where: eq(applications.id, applicationId),
      with: { contact: true }
    });

    if (!app || !app.contact) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // In production, integrate with actual credit bureau API
    // For now, we'll simulate credit pull with random score
    const creditScore = Math.floor(Math.random() * (800 - 550) + 550);
    const creditApproved = creditScore >= 600;

    // Update application with credit data
    await db.update(applications)
      .set({
        creditScore,
        ssn: ssn.slice(-4), // Only store last 4 for security
        dob,
        creditAddress: address,
        updatedAt: new Date()
      })
      .where(eq(applications.id, applicationId));

    // Update GHL with credit info via API
    try {
      const ghlResponse = await fetch(`https://api.leadconnectorhq.com/opportunities/${app.ghlOpportunityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GHL_LOCATION_KEY}`
        },
        body: JSON.stringify({
          stageName: 'Documents Pending',
          customFields: {
            'credit_score': creditScore.toString(),
            'credit_approved': creditApproved ? 'yes' : 'no'
          }
        })
      });
    } catch (err) {
      console.error('Error updating GHL opportunity:', err);
    }

    // Send approval/decision email
    if (creditApproved) {
      // Send SMS via Twilio
      if (app.contact.phone) {
        await sendSMS({
          to: app.contact.phone,
          body: `🎉 Hi ${app.contact.firstName}! Your credit is approved (${creditScore}). Upload docs here: [LINK] - Takes 5 mins!`
        });
      }

      // Trigger first follow-up (1 day later if not uploaded)
      scheduleDocumentReminder(applicationId, 1);

    } else {
      // Credit denied - offer alternatives via SMS
      if (app.contact.phone) {
        await sendSMS({
          to: app.contact.phone,
          body: `Hi ${app.contact.firstName}. We found alternative lending options for you. Call us: (949) 997-2097`
        });
      }
    }

    res.json({
      success: true,
      creditScore,
      creditApproved,
      stage: 'Documents Pending',
      message: creditApproved ? 'Credit approved - documents needed' : 'Alternative products available'
    });

  } catch (error: any) {
    console.error('Credit pull error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/pipeline/documents-upload
 * Stage 3: Document Collection
 * Handle document uploads, track completion, auto-move to next stage
 */
router.post('/pipeline/documents-upload', async (req: Request, res: Response) => {
  try {
    const { applicationId, documentType, fileUrl, fileName } = req.body;

    if (!applicationId || !documentType || !fileUrl) {
      return res.status(400).json({ error: 'applicationId, documentType, and fileUrl required' });
    }

    // Get application
    const app = await db.query.applications.findFirst({
      where: eq(applications.id, applicationId),
      with: { contact: true }
    });

    if (!app || !app.contact) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Track uploaded documents
    const uploadedDocs = (app.documentsUploaded || []) as string[];
    if (!uploadedDocs.includes(documentType)) {
      uploadedDocs.push(documentType);
    }

    // Define required documents
    const requiredDocs = ['tax_returns', 'bank_statements', 'drivers_license'];
    const businessRequiredDocs = [...requiredDocs, 'business_license'];

    const isBusinessLoan = app.loanType === 'business' || app.businessName;
    const allDocsRequired = isBusinessLoan ? businessRequiredDocs : requiredDocs;
    const allDocsUploaded = allDocsRequired.every(doc => uploadedDocs.includes(doc));

    // Update application
    await db.update(applications)
      .set({
        documentsUploaded: uploadedDocs,
        documentUploadDate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(applications.id, applicationId));

    // Update GHL
    const missingDocs = allDocsRequired.filter(doc => !uploadedDocs.includes(doc));
    const ghlStage = allDocsUploaded ? 'Full Application Complete' : 'Documents Pending';

    // Update opportunity in GHL
    try {
      await fetch(`https://api.leadconnectorhq.com/opportunities/${app.ghlOpportunityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GHL_LOCATION_KEY}`
        },
        body: JSON.stringify({
          stageName: ghlStage,
          customFields: {
            'documents_uploaded': uploadedDocs.join(', '),
            'documents_missing': missingDocs.join(', '),
            'all_docs_uploaded': allDocsUploaded ? 'yes' : 'no'
          }
        })
      });
    } catch (err) {
      console.error('Error updating GHL:', err);
    }

    // If all docs uploaded, move to full app complete
    if (allDocsUploaded) {
      await db.update(applications)
        .set({
          status: 'application_complete',
          applicationCompleteDate: new Date()
        })
        .where(eq(applications.id, applicationId));

      // Send confirmation SMS
      if (app.contact.phone) {
        await sendSMS({
          to: app.contact.phone,
          body: `✅ Application complete! We're reviewing now. You'll hear from us within 24 hours.`
        });
      }

      // Trigger lender selection and submission
      setTimeout(() => {
        selectAndSubmitToLender(applicationId);
      }, 2000);

    } else {
      // Still missing documents - send reminder SMS
      if (app.contact.phone) {
        await sendSMS({
          to: app.contact.phone,
          body: `📄 Still need docs: ${missingDocs.map(formatDocName).join(', ')}. Upload here: [LINK]`
        });
      }
    }

    res.json({
      success: true,
      documentType,
      uploadedDocs,
      missingDocs,
      allDocsUploaded,
      stage: ghlStage,
      message: allDocsUploaded ? 'All documents received - moving to lender submission' : 'Document recorded - still waiting for others'
    });

  } catch (error: any) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/pipeline/submit-to-lender
 * Stage 5: Submit to Lender
 * AI selects best lender, submits application, starts follow-ups
 */
router.post('/pipeline/submit-to-lender', async (req: Request, res: Response) => {
  try {
    const { applicationId, fundingPartnerId } = req.body;

    if (!applicationId) {
      return res.status(400).json({ error: 'applicationId required' });
    }

    // Get application
    const app = await db.query.applications.findFirst({
      where: eq(applications.id, applicationId),
      with: { contact: true }
    });

    if (!app || !app.contact) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Auto-select lender if not provided
    let selectedPartnerId = fundingPartnerId;
    if (!selectedPartnerId) {
      selectedPartnerId = autoSelectFundingPartner({
        loanType: app.loanType,
        loanAmount: app.loanAmount || 0,
        creditScore: app.creditScore || 600,
        businessIndustry: app.businessIndustry
      });
    }

    // Get partner details
    const partner = FUNDING_PARTNERS.find(p => p.id === selectedPartnerId);

    if (!partner) {
      return res.status(400).json({ error: 'Invalid funding partner' });
    }

    // Update application with selected lender
    await db.update(applications)
      .set({
        fundingPartnerId: selectedPartnerId,
        lenderSelected: partner.name,
        submissionDate: new Date(),
        status: 'submitted_to_lender',
        updatedAt: new Date()
      })
      .where(eq(applications.id, applicationId));

    // Update GHL stage
    try {
      await fetch(`https://api.leadconnectorhq.com/opportunities/${app.ghlOpportunityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GHL_LOCATION_KEY}`
        },
        body: JSON.stringify({
          stageName: 'Sent to Lender',
          customFields: {
            'funding_partner': partner.name,
            'submission_date': new Date().toISOString().split('T')[0],
            'lender_contact': partner.primaryContact || ''
          }
        })
      });
    } catch (err) {
      console.error('Error updating GHL:', err);
    }

    // Send notification to client via SMS
    if (app.contact.phone) {
      await sendSMS({
        to: app.contact.phone,
        body: `✅ Your $${(app.loanAmount || 0).toLocaleString()} loan application sent to ${partner.name}! You'll hear back in 1-3 days.`
      });
    }

    // Create follow-up tasks
    createUnderwritingFollowUps(applicationId, partner.name);

    res.json({
      success: true,
      fundingPartnerId: selectedPartnerId,
      fundingPartner: partner.name,
      stage: 'Sent to Lender',
      message: 'Application submitted to ' + partner.name
    });

  } catch (error: any) {
    console.error('Submit to lender error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/pipeline/update-status
 * Stage 5-9: Update Status During Underwriting
 * Lender sends status updates, triggers follow-ups
 */
router.post('/pipeline/update-status', async (req: Request, res: Response) => {
  try {
    const { applicationId, status, stage, notes, lenderNotes } = req.body;

    if (!applicationId || !status) {
      return res.status(400).json({ error: 'applicationId and status required' });
    }

    // Get application
    const app = await db.query.applications.findFirst({
      where: eq(applications.id, applicationId),
      with: { contact: true }
    });

    if (!app || !app.contact) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Map status to GHL stage
    const statusToStage: Record<string, string> = {
      'under_review': 'Sent to Lender',
      'additional_docs_needed': 'Documents Pending',
      'approved': 'Signature/Qualified',
      'conditionally_approved': 'Signature/Qualified',
      'declined': 'Disqualified',
      'funded': 'Funded $'
    };

    const ghlStage = stage || statusToStage[status] || 'Sent to Lender';

    // Update application
    await db.update(applications)
      .set({
        status,
        lenderStatus: status,
        lenderNotes,
        statusLastUpdated: new Date(),
        updatedAt: new Date()
      })
      .where(eq(applications.id, applicationId));

    // Update GHL
    try {
      await fetch(`https://api.leadconnectorhq.com/opportunities/${app.ghlOpportunityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GHL_LOCATION_KEY}`
        },
        body: JSON.stringify({
          stageName: ghlStage,
          customFields: {
            'lender_status': status,
            'status_updated_at': new Date().toISOString()
          }
        })
      });
    } catch (err) {
      console.error('Error updating GHL:', err);
    }

    // Handle different status outcomes
    if (status === 'approved' || status === 'conditionally_approved') {
      await handleApproval(applicationId, app);
    } else if (status === 'additional_docs_needed') {
      await handleAdditionalDocsNeeded(applicationId, app, lenderNotes);
    } else if (status === 'declined') {
      await handleDeclined(applicationId, app, lenderNotes);
    } else if (status === 'funded') {
      await handleFunded(applicationId, app);
    } else if (status === 'under_review') {
      // Schedule follow-up checks
      scheduleUnderwritingFollowUp(applicationId, 3); // 3 days
    }

    res.json({
      success: true,
      status,
      stage: ghlStage,
      message: 'Status updated: ' + status
    });

  } catch (error: any) {
    console.error('Update status error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pipeline/status/:id
 * Get current status of application
 */
router.get('/pipeline/status/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const app = await db.query.applications.findFirst({
      where: eq(applications.id, parseInt(id)),
      with: { contact: true }
    });

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      success: true,
      applicationId: app.id,
      status: app.status,
      stage: app.stage,
      lenderStatus: app.lenderStatus,
      fundingPartner: app.lenderSelected,
      creditScore: app.creditScore,
      documentsUploaded: app.documentsUploaded,
      approvalDate: app.approvalDate,
      fundingDate: app.fundingDate,
      amountWon: app.amountWon,
      timeline: {
        submissionDate: app.submissionDate,
        statusLastUpdated: app.statusLastUpdated,
        approvalDate: app.approvalDate,
        fundingDate: app.fundingDate
      }
    });

  } catch (error: any) {
    console.error('Get status error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/webhook/ghl-pipeline
 * Webhook handler for GHL updates
 * Receives real-time updates from GHL when pipeline stage changes
 */
router.post('/webhook/ghl-pipeline', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    console.log('📬 GHL Webhook received:', type);

    if (type === 'opportunity.updated') {
      const { id, stageName, customFields } = data;

      // Find application by GHL opportunity ID
      const app = await db.query.applications.findFirst({
        where: eq(applications.ghlOpportunityId, id),
        with: { contact: true }
      });

      if (app) {
        // Extract status from custom fields
        const lenderStatus = customFields?.lender_status || app.lenderStatus;

        // Update our database if significant changes
        if (stageName !== app.stage) {
          await db.update(applications)
            .set({
              stage: stageName,
              updatedAt: new Date()
            })
            .where(eq(applications.id, app.id));

          console.log(`✅ Updated app ${app.id} stage to ${stageName}`);
        }
      }
    }

    res.json({ success: true });

  } catch (error: any) {
    console.error('GHL webhook error:', error);
    res.json({ success: true }); // Always return 200 to avoid retry loops
  }
});

// ============= HELPER FUNCTIONS =============

async function handleApproval(applicationId: number, app: any) {
  const { contact } = app;

  // Update application
  await db.update(applications)
    .set({
      status: 'approved',
      approvalDate: new Date(),
      stage: 'Signature/Qualified'
    })
    .where(eq(applications.id, applicationId));

  // Send celebration SMS
  if (contact.phone) {
    await sendSMS({
      to: contact.phone,
      body: `🎉 APPROVED! Your $${(app.loanAmount || 0).toLocaleString()} loan is approved! Sign docs here: [LINK]`
    });
  }
}

async function handleAdditionalDocsNeeded(applicationId: number, app: any, lenderNotes: string) {
  const { contact } = app;

  await db.update(applications)
    .set({
      status: 'additional_docs_needed',
      stage: 'Documents Pending'
    })
    .where(eq(applications.id, applicationId));

  if (contact.phone) {
    await sendSMS({
      to: contact.phone,
      body: `📄 Lender needs additional docs: ${lenderNotes.substring(0, 50)}... Call us: (949) 997-2097`
    });
  }
}

async function handleDeclined(applicationId: number, app: any, lenderNotes: string) {
  const { contact } = app;

  await db.update(applications)
    .set({
      status: 'declined',
      stage: 'Disqualified'
    })
    .where(eq(applications.id, applicationId));

  if (contact.phone) {
    await sendSMS({
      to: contact.phone,
      body: `We have other lending options available. Let's talk! Call: (949) 997-2097`
    });
  }

  // Schedule 3-month follow-up for retry
  scheduleRetryFollowUp(applicationId, 90); // 90 days
}

async function handleFunded(applicationId: number, app: any) {
  const { contact } = app;

  // Calculate amount won based on loan amount
  const amountWon = app.loanAmount || 0;

  await db.update(applications)
    .set({
      status: 'funded',
      stage: 'Funded $',
      fundingDate: new Date(),
      amountWon
    })
    .where(eq(applications.id, applicationId));

  // Update GHL with funding info
  try {
    await fetch(`https://api.leadconnectorhq.com/opportunities/${app.ghlOpportunityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GHL_LOCATION_KEY}`
      },
      body: JSON.stringify({
        stageName: 'Funded $',
        customFields: {
          'amount_won': amountWon.toString(),
          'funded_date': new Date().toISOString().split('T')[0]
        }
      })
    });
  } catch (err) {
    console.error('Error updating GHL:', err);
  }

  // Celebration SMS
  if (contact.phone) {
    await sendSMS({
      to: contact.phone,
      body: `💰 YOU'RE FUNDED! $${amountWon.toLocaleString()} is on the way! Expect it within 24-48 hours.`
    });
  }

  // Schedule 30-day check-in
  schedulePostFundingFollowUp(applicationId, 30);
}

async function selectAndSubmitToLender(applicationId: number) {
  try {
    await fetch('/api/pipeline/submit-to-lender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId })
    });
  } catch (error) {
    console.error('Auto-submit to lender failed:', error);
  }
}

function scheduleDocumentReminder(applicationId: number, daysDelay: number) {
  // In production, use a job queue (Bull, RabbitMQ, etc.)
  // For now, just log the scheduling
  console.log(`📅 Scheduled document reminder for app ${applicationId} in ${daysDelay} day(s)`);
}

function createUnderwritingFollowUps(applicationId: number, lenderName: string) {
  console.log(`📅 Scheduled underwriting follow-ups for ${lenderName} on app ${applicationId}`);
}

function scheduleUnderwritingFollowUp(applicationId: number, daysDelay: number) {
  console.log(`📅 Scheduled underwriting follow-up for app ${applicationId} in ${daysDelay} day(s)`);
}

function scheduleRetryFollowUp(applicationId: number, daysDelay: number) {
  console.log(`📅 Scheduled retry follow-up for app ${applicationId} in ${daysDelay} day(s)`);
}

function schedulePostFundingFollowUp(applicationId: number, daysDelay: number) {
  console.log(`📅 Scheduled post-funding follow-up for app ${applicationId} in ${daysDelay} day(s)`);
}

function formatDocName(docType: string): string {
  const names: Record<string, string> = {
    'tax_returns': 'Tax Returns (2 years)',
    'bank_statements': 'Bank Statements (3 months)',
    'drivers_license': 'Driver\'s License',
    'business_license': 'Business License',
    'proof_of_collateral': 'Proof of Collateral'
  };
  return names[docType] || docType;
}

export default router;
