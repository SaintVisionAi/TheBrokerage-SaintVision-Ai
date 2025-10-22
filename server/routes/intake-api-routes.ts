import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth';
import nodemailer from 'nodemailer';

const router = Router();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// =====================================================
// REAL ESTATE BROKER INTAKE
// =====================================================

router.post('/intake/real-estate-broker', isAuthenticated, async (req, res) => {
  try {
    const { applicationId, userInfo, intakeData } = req.body;

    if (!userInfo?.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Create GHL opportunity for real estate broker service
    const ghlOppResponse = await createGHLOpportunity({
      contactName: `${userInfo.firstName} ${userInfo.lastName}`,
      email: userInfo.email,
      phone: userInfo.phone,
      pipelineId: process.env.GHL_REAL_ESTATE_BROKER_PIPELINE_ID,
      stageName: 'Intake Form Submitted',
      monetaryValue: estimatePropertyValue(intakeData.buyingBudgetMax || intakeData.sellingAskingPrice || 0),
      customFields: {
        transactionType: intakeData.transactionType,
        propertyLocation: `${intakeData.propertyCity}, ${intakeData.propertyState}`,
        propertyType: intakeData.propertyType,
        timeline: intakeData.buyingTimeline || intakeData.sellingTimeline,
        urgency: intakeData.urgencyLevel,
      },
    });

    const oppId = ghlOppResponse?.id || 'manual-' + Date.now();

    // Create email template for JR & Ryan
    const emailContent = generateRealEstateEmailContent(userInfo, intakeData, oppId);

    // Send emails
    await Promise.all([
      // Email to JR
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'jr@hacpglobal.ai',
        subject: `🏡 New Real Estate Broker Intake - ${userInfo.firstName} ${userInfo.lastName}`,
        html: emailContent,
      }),
      // Email to Ryan
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'ryan@cookin.io',
        subject: `🏡 New Real Estate Broker Intake - ${userInfo.firstName} ${userInfo.lastName}`,
        html: emailContent,
      }),
      // Confirmation to client
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userInfo.email,
        subject: '✅ Application Received - Real Estate Services',
        html: `
          <h2>Hi ${userInfo.firstName},</h2>
          <p>Thank you for submitting your real estate broker intake form.</p>
          <p>JR Taber will review your information and reach out within 24 hours to schedule your consultation.</p>
          <p>In the meantime, SaintBroker will be coordinating everything on our end.</p>
          <p><strong>Application ID:</strong> ${oppId}</p>
          <p>Looking forward to helping you with your real estate needs!</p>
          <p>Best regards,<br/>Saint Vision Group</p>
        `,
      }),
    ]);

    // Schedule appointment with JR via GHL calendar
    await scheduleJRAppointment({
      contactEmail: userInfo.email,
      contactName: `${userInfo.firstName} ${userInfo.lastName}`,
      serviceType: 'Real Estate Broker',
      preferredTimeOfDay: intakeData.preferredTimeOfDay,
      urgencyLevel: intakeData.urgencyLevel,
      opportunityId: oppId,
    });

    // Add tag to trigger SaintBroker workflow
    await tagContactInGHL({
      email: userInfo.email,
      tag: 'broker-intake-submitted',
    });

    res.json({
      success: true,
      message: 'Real estate broker intake submitted successfully',
      opportunityId: oppId,
    });

  } catch (error: any) {
    console.error('Real estate broker intake error:', error);
    res.status(500).json({
      error: 'Failed to submit real estate broker intake',
      details: error.message,
    });
  }
});

// =====================================================
// INVESTMENT INTAKE
// =====================================================

router.post('/intake/investment', isAuthenticated, async (req, res) => {
  try {
    const { applicationId, userInfo, intakeData } = req.body;

    if (!userInfo?.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Create GHL opportunity for investment service
    const ghlOppResponse = await createGHLOpportunity({
      contactName: `${userInfo.firstName} ${userInfo.lastName}`,
      email: userInfo.email,
      phone: userInfo.phone,
      pipelineId: process.env.GHL_INVESTMENT_PIPELINE_ID,
      stageName: 'Intake Form Submitted',
      monetaryValue: parseInvestmentAmount(intakeData.targetInvestmentAmount),
      customFields: {
        investmentTypes: intakeData.investmentTypes?.join(', '),
        investmentGoals: intakeData.investmentGoals?.join(', '),
        riskTolerance: intakeData.riskTolerance,
        experienceLevel: intakeData.experienceLevel,
        timeline: intakeData.investmentTimeline,
        urgency: intakeData.urgencyLevel,
      },
    });

    const oppId = ghlOppResponse?.id || 'manual-' + Date.now();

    // Create email template for JR & Ryan
    const emailContent = generateInvestmentEmailContent(userInfo, intakeData, oppId);

    // Send emails
    await Promise.all([
      // Email to JR
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'jr@hacpglobal.ai',
        subject: `💼 New Investment Intake - ${userInfo.firstName} ${userInfo.lastName}`,
        html: emailContent,
      }),
      // Email to Ryan
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'ryan@cookin.io',
        subject: `💼 New Investment Intake - ${userInfo.firstName} ${userInfo.lastName}`,
        html: emailContent,
      }),
      // Confirmation to client
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userInfo.email,
        subject: '✅ Application Received - Investment Services',
        html: `
          <h2>Hi ${userInfo.firstName},</h2>
          <p>Thank you for submitting your investment intake form.</p>
          <p>JR Taber will review your information and reach out within 24 hours to schedule your consultation.</p>
          <p>In the meantime, SaintBroker will be coordinating everything on our end.</p>
          <p><strong>Application ID:</strong> ${oppId}</p>
          <p>Looking forward to helping you achieve your investment goals!</p>
          <p>Best regards,<br/>Saint Vision Group</p>
        `,
      }),
    ]);

    // Schedule appointment with JR via GHL calendar
    await scheduleJRAppointment({
      contactEmail: userInfo.email,
      contactName: `${userInfo.firstName} ${userInfo.lastName}`,
      serviceType: 'Investment',
      preferredTimeOfDay: intakeData.preferredTimeOfDay,
      urgencyLevel: intakeData.urgencyLevel,
      opportunityId: oppId,
    });

    // Add tag to trigger SaintBroker workflow
    await tagContactInGHL({
      email: userInfo.email,
      tag: 'investment-intake-submitted',
    });

    res.json({
      success: true,
      message: 'Investment intake submitted successfully',
      opportunityId: oppId,
    });

  } catch (error: any) {
    console.error('Investment intake error:', error);
    res.status(500).json({
      error: 'Failed to submit investment intake',
      details: error.message,
    });
  }
});

// =====================================================
// HELPER FUNCTIONS
// =====================================================

async function createGHLOpportunity(data: any) {
  try {
    const response = await fetch('https://api.leadconnectorhq.com/v1/opportunities/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.contactName,
        pipelineId: data.pipelineId,
        pipelineStageId: data.stageId || 'default',
        monetaryValue: data.monetaryValue,
        customFields: data.customFields,
        contact: {
          name: data.contactName,
          email: data.email,
          phone: data.phone,
        },
      }),
    });

    if (!response.ok) {
      console.warn('Failed to create GHL opportunity:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error: any) {
    console.error('GHL opportunity creation error:', error);
    return null;
  }
}

async function scheduleJRAppointment(data: any) {
  try {
    // Get JR's availability from GHL calendar
    const calendarResponse = await fetch(
      `https://api.leadconnectorhq.com/v1/calendars/${process.env.GHL_JR_CALENDAR_ID}/appointments`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        },
      }
    );

    if (!calendarResponse.ok) {
      console.warn('Failed to fetch calendar availability');
      return null;
    }

    // Find next available slot based on urgency
    const appointmentTime = getNextAvailableSlot(data.urgencyLevel);

    // Create appointment
    const createResponse = await fetch(
      `https://api.leadconnectorhq.com/v1/calendars/${process.env.GHL_JR_CALENDAR_ID}/appointments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${data.serviceType} Consultation - ${data.contactName}`,
          description: `Intake form submission for ${data.serviceType} services`,
          startTime: appointmentTime.toISOString(),
          endTime: new Date(appointmentTime.getTime() + 60 * 60000).toISOString(),
          contactEmail: data.contactEmail,
          opportunityId: data.opportunityId,
        }),
      }
    );

    if (createResponse.ok) {
      return await createResponse.json();
    }

    return null;
  } catch (error: any) {
    console.error('Schedule appointment error:', error);
    return null;
  }
}

async function tagContactInGHL(data: any) {
  try {
    await fetch(`https://api.leadconnectorhq.com/v1/contacts/add-tag`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        tag: data.tag,
      }),
    });
  } catch (error: any) {
    console.error('Tag contact error:', error);
  }
}

function estimatePropertyValue(amount: number): number {
  return Math.max(amount, 250000);
}

function parseInvestmentAmount(range: string): number {
  const rangeMap: Record<string, number> = {
    '25k-50k': 37500,
    '50k-100k': 75000,
    '100k-250k': 175000,
    '250k-500k': 375000,
    '500k-1m': 750000,
    '1m-plus': 1500000,
  };
  return rangeMap[range] || 250000;
}

function getNextAvailableSlot(urgencyLevel: string): Date {
  const now = new Date();
  const slot = new Date(now);

  switch (urgencyLevel) {
    case 'very-urgent':
      // Next available (today or tomorrow)
      slot.setDate(slot.getDate() + 1);
      break;
    case 'urgent':
      // Within 1-2 days
      slot.setDate(slot.getDate() + 2);
      break;
    case 'normal':
      // Within a week
      slot.setDate(slot.getDate() + 5);
      break;
    default:
      // Flexible
      slot.setDate(slot.getDate() + 7);
  }

  // Set to 10:00 AM
  slot.setHours(10, 0, 0, 0);

  return slot;
}

function generateRealEstateEmailContent(userInfo: any, intakeData: any, oppId: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #f59e0b;">🏡 New Real Estate Broker Intake</h2>
      
      <h3>Client Information:</h3>
      <p><strong>Name:</strong> ${userInfo.firstName} ${userInfo.lastName}</p>
      <p><strong>Email:</strong> ${userInfo.email}</p>
      <p><strong>Phone:</strong> ${userInfo.phone}</p>
      <p><strong>Application ID:</strong> ${oppId}</p>
      
      <h3>Transaction Details:</h3>
      <p><strong>Type:</strong> ${intakeData.transactionType}</p>
      <p><strong>Property:</strong> ${intakeData.propertyType} in ${intakeData.propertyCity}, ${intakeData.propertyState}</p>
      
      ${intakeData.transactionType === 'buying' || intakeData.transactionType === 'both' ? `
      <h3>Buying Details:</h3>
      <p><strong>Timeline:</strong> ${intakeData.buyingTimeline}</p>
      <p><strong>Budget:</strong> $${intakeData.buyingBudgetMin} - $${intakeData.buyingBudgetMax}</p>
      <p><strong>Pre-Approved:</strong> ${intakeData.buyingPreApproved}</p>
      <p><strong>Down Payment:</strong> $${intakeData.buyingDownPayment}</p>
      ` : ''}
      
      ${intakeData.transactionType === 'selling' || intakeData.transactionType === 'both' ? `
      <h3>Selling Details:</h3>
      <p><strong>Timeline:</strong> ${intakeData.sellingTimeline}</p>
      <p><strong>Asking Price:</strong> $${intakeData.sellingAskingPrice}</p>
      <p><strong>Property Condition:</strong> ${intakeData.sellingPropertyCondition}</p>
      ` : ''}
      
      <h3>Client Profile:</h3>
      <p><strong>Type:</strong> ${intakeData.clientType}</p>
      <p><strong>Experience:</strong> ${intakeData.experienceLevel}</p>
      
      <h3>Services Needed:</h3>
      <ul>
        ${intakeData.servicesNeeded?.map((s: string) => `<li>${s}</li>`).join('') || '<li>Not specified</li>'}
      </ul>
      
      <h3>Preferences:</h3>
      <p><strong>Contact Method:</strong> ${intakeData.preferredContactMethod}</p>
      <p><strong>Time:</strong> ${intakeData.preferredTimeOfDay}</p>
      <p><strong>Urgency:</strong> ${intakeData.urgencyLevel}</p>
      
      ${intakeData.additionalNotes ? `<h3>Notes:</h3><p>${intakeData.additionalNotes}</p>` : ''}
      
      <hr style="border: 1px solid #ccc; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Next Steps:<br/>
        1. Review intake form above<br/>
        2. Check GHL calendar for scheduled appointment<br/>
        3. SaintBroker will handle follow-up<br/>
        4. Contact client to confirm consultation
      </p>
    </div>
  `;
}

function generateInvestmentEmailContent(userInfo: any, intakeData: any, oppId: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #f59e0b;">💼 New Investment Intake</h2>
      
      <h3>Client Information:</h3>
      <p><strong>Name:</strong> ${userInfo.firstName} ${userInfo.lastName}</p>
      <p><strong>Email:</strong> ${userInfo.email}</p>
      <p><strong>Phone:</strong> ${userInfo.phone}</p>
      <p><strong>Application ID:</strong> ${oppId}</p>
      
      <h3>Investment Profile:</h3>
      <p><strong>Investment Types:</strong> ${intakeData.investmentTypes?.join(', ') || 'Not specified'}</p>
      <p><strong>Target Amount:</strong> ${intakeData.targetInvestmentAmount}</p>
      <p><strong>Timeline:</strong> ${intakeData.investmentTimeline}</p>
      <p><strong>Exit Timeframe:</strong> ${intakeData.exitTimeframe}</p>
      
      <h3>Investment Goals:</h3>
      <ul>
        ${intakeData.investmentGoals?.map((g: string) => `<li>${g}</li>`).join('') || '<li>Not specified</li>'}
      </ul>
      
      <h3>Risk & Experience:</h3>
      <p><strong>Risk Tolerance:</strong> ${intakeData.riskTolerance}</p>
      <p><strong>Experience Level:</strong> ${intakeData.experienceLevel}</p>
      <p><strong>Years Investing:</strong> ${intakeData.yearsInvesting || 'N/A'}</p>
      <p><strong>Current Portfolio:</strong> ${intakeData.currentPortfolioValue || 'Not specified'}</p>
      
      <h3>Preferences:</h3>
      <p><strong>Investment Approach:</strong> ${intakeData.preferredInvestmentType}</p>
      <p><strong>Geographic Preference:</strong> ${intakeData.geographicPreference || 'No preference'}</p>
      <p><strong>Contact Method:</strong> ${intakeData.preferredContactMethod}</p>
      <p><strong>Time:</strong> ${intakeData.preferredTimeOfDay}</p>
      <p><strong>Urgency:</strong> ${intakeData.urgencyLevel}</p>
      
      ${intakeData.specificOpportunities ? `<h3>Opportunities:</h3><p>${intakeData.specificOpportunities}</p>` : ''}
      ${intakeData.additionalNotes ? `<h3>Notes:</h3><p>${intakeData.additionalNotes}</p>` : ''}
      
      <hr style="border: 1px solid #ccc; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Next Steps:<br/>
        1. Review intake form above<br/>
        2. Check GHL calendar for scheduled appointment<br/>
        3. SaintBroker will handle follow-up<br/>
        4. Contact client to confirm consultation
      </p>
    </div>
  `;
}

export default router;
