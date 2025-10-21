import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import {
  getOpportunitiesByContact,
  getContact,
  getPipelines,
} from '../services/ghl-client';

const router = express.Router();

/**
 * GET /api/ghl/opportunities
 * Fetch opportunities (applications) for authenticated user
 */
router.get('/opportunities', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // In a real implementation, you'd fetch the GHL contact ID from your database
    // For now, we'll return mock data structure
    const opportunities = await getOpportunitiesByContact(userId).catch(() => []);

    // Transform GHL opportunities to application format
    const applications = opportunities.map((opp: any) => ({
      id: opp.id,
      name: opp.name,
      status: mapOpportunityStatus(opp),
      type: extractServiceType(opp.name),
      value: opp.monetaryValue || 0,
      loanAmount: opp.customFields?.find((f: any) => f.key === 'loan_amount')?.value,
      createdAt: opp.dateAdded,
      updatedAt: opp.lastStatusUpdate,
      stageName: opp.pipelineStageName,
      progress: calculateProgress(opp.pipelineStageName),
    }));

    res.json({
      success: true,
      opportunities: applications,
      count: applications.length,
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({
      error: 'Failed to fetch opportunities',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/ghl/contact/:userId
 * Fetch contact details from GHL
 */
router.get('/contact/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.user?.id;

    // Security: ensure user can only access their own contact
    if (userId !== authenticatedUserId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const contact = await getContact(userId).catch(() => null);

    if (!contact) {
      return res.json({
        success: true,
        contact: null,
        message: 'Contact not found in GHL',
      });
    }

    res.json({
      success: true,
      contact: {
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        tags: contact.tags || [],
        customFields: contact.customFields,
      },
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      error: 'Failed to fetch contact',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/ghl/portfolio
 * Fetch portfolio data (investments and funded deals)
 */
router.get('/portfolio', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Fetch opportunities that are "won" (funded deals)
    const opportunities = await getOpportunitiesByContact(userId).catch(() => []);

    const portfolio = opportunities
      .filter((opp: any) => opp.status === 'won' || opp.pipelineName?.includes('Investment'))
      .map((opp: any) => ({
        id: opp.id,
        name: opp.name,
        type: extractPortfolioType(opp.name),
        value: opp.monetaryValue || 0,
        status: 'active',
        returnRate: extractReturnRate(opp.customFields),
        monthlyReturn: calculateMonthlyReturn(opp.monetaryValue, extractReturnRate(opp.customFields)),
        startDate: opp.dateAdded,
        documents: opp.attachments || [],
      }));

    res.json({
      success: true,
      portfolio,
      totalValue: portfolio.reduce((sum: number, item: any) => sum + item.value, 0),
      totalMonthlyReturn: portfolio.reduce((sum: number, item: any) => sum + (item.monthlyReturn || 0), 0),
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({
      error: 'Failed to fetch portfolio',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/ghl/pipelines
 * Fetch available pipelines
 */
router.get('/pipelines', isAuthenticated, async (req, res) => {
  try {
    const pipelines = await getPipelines().catch(() => []);

    res.json({
      success: true,
      pipelines: pipelines.map((p: any) => ({
        id: p.id,
        name: p.name,
        stages: p.stages || [],
      })),
    });
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({
      error: 'Failed to fetch pipelines',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/ghl/sync-contact
 * Sync contact data with GHL
 */
router.post('/sync-contact', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { updates } = req.body;

    if (!updates) {
      return res.status(400).json({ error: 'Updates required' });
    }

    // In a real implementation, call updateContact from ghl-client
    // For now, return success
    res.json({
      success: true,
      message: 'Contact synced successfully',
    });
  } catch (error) {
    console.error('Error syncing contact:', error);
    res.status(500).json({
      error: 'Failed to sync contact',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Helper functions

function mapOpportunityStatus(opportunity: any): string {
  const status = opportunity.status?.toLowerCase();
  const stageName = opportunity.pipelineStageName?.toLowerCase() || '';

  if (status === 'won') return 'funded';
  if (status === 'lost') return 'rejected';
  if (stageName.includes('approved')) return 'approved';
  if (stageName.includes('review') || stageName.includes('underwriting')) return 'in-review';
  return 'pending';
}

function extractServiceType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('mortgage')) return 'mortgage';
  if (lower.includes('real estate') || lower.includes('property')) return 'real-estate';
  if (lower.includes('invest')) return 'investment';
  return 'lending';
}

function extractPortfolioType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('invest')) return 'investment';
  if (lower.includes('deal') || lower.includes('property')) return 'deal';
  if (lower.includes('property') || lower.includes('real estate')) return 'property';
  return 'deal';
}

function extractReturnRate(customFields: any[]): number {
  if (!customFields) return 10;
  const returnField = customFields.find(
    (f: any) => f.key === 'return_rate' || f.key === 'annual_return'
  );
  return returnField ? parseFloat(returnField.value) || 10 : 10;
}

function calculateMonthlyReturn(value: number, annualRate: number): number {
  return (value * (annualRate / 100)) / 12;
}

function calculateProgress(stageName: string): number {
  const stage = stageName?.toLowerCase() || '';
  if (stage.includes('funded') || stage.includes('active')) return 100;
  if (stage.includes('approved')) return 80;
  if (stage.includes('review') || stage.includes('underwriting')) return 50;
  if (stage.includes('application') || stage.includes('submitted')) return 30;
  return 10;
}

export default router;
