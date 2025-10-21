import axios from 'axios';

const GHL_API_BASE = 'https://rest.gohighlevel.com/v1';
const GHL_PRIVATE_TOKEN = process.env.GHL_PRIVATE_ACCESS_TOKEN || 'pit-867ef626-39f8-4e19-b610-6736c9c35eac';

interface FormSubmissionPayload {
  formId: string;
  data: Record<string, any>;
}

interface FieldMapping {
  [key: string]: string; // Maps form field names to GHL field IDs
}

// Field ID mappings for different forms
const FORM_FIELD_MAPPINGS: { [formId: string]: FieldMapping } = {
  // Apply Now SVG2 form (pre-qual)
  'gPGc1pTZGRvxybqPpDRL': {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    businessName: 'businessName',
    businessStructure: 'businessStructure',
    yearsInBusiness: 'yearsInBusiness',
    industry: 'industry',
    annualRevenue: 'annualRevenue',
    serviceType: 'serviceType',
    loanAmount: 'loanAmount',
    loanPurpose: 'loanPurpose',
    creditScore: 'creditScore',
    hasCollateral: 'hasCollateral',
    additionalNotes: 'additionalNotes'
  },
  // Full Lending Application form
  '0zcz0ZlG2eEddg94wcbq': {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    businessName: 'businessName',
    businessStructure: 'businessStructure',
    yearsInBusiness: 'yearsInBusiness',
    industry: 'industry',
    annualRevenue: 'annualRevenue',
    serviceType: 'serviceType',
    loanAmount: 'loanAmount',
    loanPurpose: 'loanPurpose',
    creditScore: 'creditScore',
    hasCollateral: 'hasCollateral',
    additionalNotes: 'additionalNotes'
  },
  // Document Upload form
  'yLjMJMuW3mM08ju9GkWY': {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    businessName: 'businessName'
  },
  // Investment Intake form
  '1pivHofKUp5uTa9ws1TG': {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    investmentAmount: 'investmentAmount',
    investmentType: 'investmentType'
  },
  // Real Estate Lead form
  'M2jNYXh8wl8FYhxOap9N': {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    propertyType: 'propertyType',
    loanAmount: 'loanAmount'
  }
};

export async function submitFormToGHL(formId: string, formData: Record<string, any>): Promise<any> {
  try {
    console.log(`[GHL] Submitting form ${formId} to GHL...`);

    // Get field mappings for this form
    const fieldMapping = FORM_FIELD_MAPPINGS[formId];
    if (!fieldMapping) {
      console.warn(`[GHL] No field mapping found for form ${formId}, using raw data`);
    }

    // Map form fields to GHL field IDs
    const mappedData: Record<string, any> = {};
    if (fieldMapping) {
      for (const [appField, ghlField] of Object.entries(fieldMapping)) {
        if (formData[appField] !== undefined && formData[appField] !== null && formData[appField] !== '') {
          mappedData[ghlField] = formData[appField];
        }
      }
    } else {
      // Fallback: use form data as-is if no mapping exists
      for (const [key, value] of Object.entries(formData)) {
        if (value !== undefined && value !== null && value !== '') {
          mappedData[key] = value;
        }
      }
    }

    // Submit to GHL API
    const response = await axios.post(
      `${GHL_API_BASE}/forms/${formId}/submit`,
      {
        data: mappedData
      },
      {
        headers: {
          'Authorization': `Bearer ${GHL_PRIVATE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[GHL] Form ${formId} submitted successfully:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`[GHL] Error submitting form ${formId}:`, error.response?.data || error.message);
    throw new Error(`GHL Form Submission Failed: ${error.response?.data?.message || error.message}`);
  }
}

export async function submitPreQualForm(formData: Record<string, any>): Promise<any> {
  return submitFormToGHL('gPGc1pTZGRvxybqPpDRL', formData);
}

export async function submitFullLendingApplicationForm(formData: Record<string, any>): Promise<any> {
  return submitFormToGHL('0zcz0ZlG2eEddg94wcbq', formData);
}

export async function submitDocumentUploadForm(formData: Record<string, any>): Promise<any> {
  return submitFormToGHL('yLjMJMuW3mM08ju9GkWY', formData);
}

export async function submitInvestmentIntakeForm(formData: Record<string, any>): Promise<any> {
  return submitFormToGHL('1pivHofKUp5uTa9ws1TG', formData);
}

export async function submitRealEstateLeadForm(formData: Record<string, any>): Promise<any> {
  return submitFormToGHL('M2jNYXh8wl8FYhxOap9N', formData);
}
