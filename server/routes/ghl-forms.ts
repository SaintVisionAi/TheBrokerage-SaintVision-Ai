import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { processNewLead } from '../services/ghl-client';

const router = express.Router();

/**
 * POST /api/ghl-forms/submit
 * Handle form submissions and process with GHL
 */
router.post('/submit', async (req, res) => {
  try {
    const { formType, formData } = req.body;

    if (!formType || !formData) {
      return res.status(400).json({
        error: 'Missing formType or formData',
      });
    }

    // Process the lead through GHL
    const leadData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      service: formData.serviceType || 'lending',
      loanAmount: formData.loanAmount,
      propertyAddress: formData.propertyAddress,
      creditScore: formData.creditScore,
      source: `Form: ${formType}`,
    };

    const result = await processNewLead(leadData);

    res.json({
      success: true,
      leadId: result.contact.id,
      applicationId: result.opportunity?.id,
      message: 'Form submitted successfully and lead created in GHL',
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      error: 'Form submission failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/ghl-forms/validate
 * Validate form data before submission
 */
router.post('/validate', async (req, res) => {
  try {
    const { formType, formData } = req.body;

    if (!formType || !formData) {
      return res.status(400).json({
        error: 'Missing formType or formData',
      });
    }

    const errors: Record<string, string> = {};

    // Validate required fields based on form type
    const requiredFields = getRequiredFieldsForFormType(formType);

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors[field] = `${field} is required`;
      }
    }

    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
      errors.email = 'Invalid email address';
    }

    // Phone validation
    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    // Loan amount validation
    if (formData.loanAmount) {
      const amount = parseLoanAmount(formData.loanAmount);
      if (amount < 50000 || amount > 10000000) {
        errors.loanAmount = 'Loan amount must be between $50K and $10M';
      }
    }

    res.json({
      valid: Object.keys(errors).length === 0,
      errors,
    });
  } catch (error) {
    console.error('Error validating form:', error);
    res.status(500).json({
      error: 'Form validation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/ghl-forms/save-draft
 * Save form as draft for later completion
 */
router.post('/save-draft', isAuthenticated, async (req, res) => {
  try {
    const { formType, formData } = req.body;
    const userId = req.user?.id;

    if (!formType || !formData || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    // In a real implementation, save draft to database
    // For now, just return success
    res.json({
      success: true,
      draftId: `draft_${Date.now()}`,
      message: 'Draft saved successfully',
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({
      error: 'Failed to save draft',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/ghl-forms/draft/:draftId
 * Retrieve a saved draft
 */
router.get('/draft/:draftId', isAuthenticated, async (req, res) => {
  try {
    const { draftId } = req.params;

    // In a real implementation, fetch draft from database
    res.json({
      success: true,
      draft: null,
      message: 'Draft not found',
    });
  } catch (error) {
    console.error('Error retrieving draft:', error);
    res.status(500).json({
      error: 'Failed to retrieve draft',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Helper Functions

function getRequiredFieldsForFormType(formType: string): string[] {
  const requiredFields: Record<string, string[]> = {
    'pre-qual': ['firstName', 'lastName', 'email', 'phone', 'loanAmount', 'serviceType'],
    'full-application': [
      'firstName',
      'lastName',
      'email',
      'phone',
      'businessName',
      'yearsInBusiness',
      'monthlyRevenue',
      'loanAmount',
      'loanPurpose',
      'businessAddress',
    ],
    'document-upload': ['email', 'documentType', 'documentName'],
    'investment': ['firstName', 'lastName', 'email', 'phone', 'investmentAmount'],
    'real-estate': [
      'firstName',
      'lastName',
      'email',
      'phone',
      'propertyType',
      'propertyAddress',
      'loanAmount',
    ],
    'svt-registration': ['firstName', 'lastName', 'email', 'phone'],
    'mortgage': [
      'firstName',
      'lastName',
      'email',
      'phone',
      'propertyAddress',
      'purchasePrice',
      'downPayment',
    ],
  };

  return requiredFields[formType] || [];
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

function parseLoanAmount(amount: string | number): number {
  if (typeof amount === 'number') return amount;

  const str = String(amount).toUpperCase().trim();

  // Remove dollar signs and commas
  let cleaned = str.replace(/[\$,]/g, '').trim();

  // Handle M (millions)
  if (cleaned.includes('M')) {
    const num = parseFloat(cleaned);
    return num * 1000000;
  }

  // Handle K (thousands)
  if (cleaned.includes('K')) {
    const num = parseFloat(cleaned);
    return num * 1000;
  }

  return parseInt(cleaned) || 0;
}

export default router;
