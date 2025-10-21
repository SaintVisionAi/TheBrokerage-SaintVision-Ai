/**
 * GoHighLevel Form Submission Service
 * Handles posting form data to GHL endpoints to trigger CRM workflows
 */

export interface GHLFormData {
  [key: string]: string | number | boolean | File | null;
}

export interface GHLSubmissionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Submit form data to GoHighLevel
 * This mimics what the GHL iframe does but with custom UI
 */
export async function submitToGHL(
  formId: string,
  formData: GHLFormData
): Promise<GHLSubmissionResponse> {
  try {
    // GHL form submission endpoint
    const endpoint = `https://api.leadconnectorhq.com/widget/form/${formId}`;

    // Convert form data to FormData for submission
    const submitData = new FormData();
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          submitData.append(key, value);
        } else {
          submitData.append(key, String(value));
        }
      }
    });

    // Submit to GHL
    const response = await fetch(endpoint, {
      method: 'POST',
      body: submitData,
      // Don't set Content-Type - browser will set it with boundary for FormData
    });

    if (!response.ok) {
      throw new Error(`GHL submission failed: ${response.status}`);
    }

    return {
      success: true,
      message: 'Form submitted successfully'
    };

  } catch (error) {
    console.error('GHL submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Submission failed'
    };
  }
}

/**
 * Form ID mapping for easy reference
 */
export const GHL_FORMS = {
  PRE_QUAL: 'gPGc1pTZGRvxybqPpDRL',           // Apply Now SVG2
  FULL_APPLICATION: '0zcz0ZlG2eEddg94wcbq',   // Full Lending Application
  DOC_UPLOAD: 'yLjMJMuW3mM08ju9GkWY',         // Secure Upload Portal
  INVESTMENT: '1pivHofKUp5uTa9ws1TG',         // Investment Quick Form
  REAL_ESTATE: 'M2jNYXh8wl8FYhxOap9N',       // Real Estate Lead Gen
  SVT_REGISTRATION: 'BmPNIXxZcCjsVhFTVddI',  // SVT Impact Team
  MORTGAGE: 'nYhOnZmZP1mH1MWGLNBd'            // Mortgage Lender Request
} as const;

/**
 * Field name mapping to ensure compatibility with GHL
 * These should match the field names GHL expects
 */
export const GHL_FIELD_NAMES = {
  // Personal Info
  FULL_NAME: 'full_name',
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  EMAIL: 'email',
  PHONE: 'phone',
  DATE_OF_BIRTH: 'date_of_birth',
  
  // Address
  ADDRESS: 'address',
  CITY: 'city',
  STATE: 'state',
  ZIP: 'zip_code',
  
  // Application specific
  LOAN_AMOUNT: 'loan_amount',
  PROPERTY_TYPE: 'property_type',
  CREDIT_SCORE: 'credit_score',
  EMPLOYMENT_STATUS: 'employment_status',
  ANNUAL_INCOME: 'annual_income',
  
  // Investment specific
  INVESTMENT_AMOUNT: 'investment_amount',
  INVESTMENT_TYPE: 'investment_type',
  RISK_TOLERANCE: 'risk_tolerance',
  
  // File uploads
  DOCUMENTS: 'documents',
  
  // General
  MESSAGE: 'message',
  NOTES: 'notes'
} as const;
