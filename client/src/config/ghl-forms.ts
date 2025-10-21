/**
 * GoHighLevel Form Configuration
 * Maps form types to GHL Form IDs and field mappings
 */

export enum GHLFormType {
  PRE_QUAL = 'pre-qual',
  FULL_APPLICATION = 'full-application',
  DOCUMENT_UPLOAD = 'document-upload',
  INVESTMENT = 'investment',
  REAL_ESTATE = 'real-estate',
  SVT_REGISTRATION = 'svt-registration',
  MORTGAGE = 'mortgage',
}

export interface GHLFieldMapping {
  fieldName: string;
  ghlFieldName: string;
  required: boolean;
  type: 'text' | 'email' | 'phone' | 'number' | 'date' | 'select' | 'textarea';
}

export interface GHLFormConfig {
  formId: string;
  formName: string;
  description: string;
  endpoint: string;
  fieldMappings: Record<string, GHLFieldMapping>;
}

// Form IDs - These should match your GHL setup
// If you don't have specific form IDs yet, we'll use placeholder structure
const GHL_FORM_IDS = {
  [GHLFormType.PRE_QUAL]: process.env.REACT_APP_GHL_PREQUAL_FORM_ID || 'prequal_form_id',
  [GHLFormType.FULL_APPLICATION]: process.env.REACT_APP_GHL_APPLICATION_FORM_ID || 'application_form_id',
  [GHLFormType.DOCUMENT_UPLOAD]: process.env.REACT_APP_GHL_DOCUMENT_FORM_ID || 'document_form_id',
  [GHLFormType.INVESTMENT]: process.env.REACT_APP_GHL_INVESTMENT_FORM_ID || 'investment_form_id',
  [GHLFormType.REAL_ESTATE]: process.env.REACT_APP_GHL_REALESTATE_FORM_ID || 'realestate_form_id',
  [GHLFormType.SVT_REGISTRATION]: process.env.REACT_APP_GHL_SVT_FORM_ID || 'svt_form_id',
  [GHLFormType.MORTGAGE]: process.env.REACT_APP_GHL_MORTGAGE_FORM_ID || 'mortgage_form_id',
};

export const GHL_FORM_CONFIGS: Record<GHLFormType, GHLFormConfig> = {
  [GHLFormType.PRE_QUAL]: {
    formId: GHL_FORM_IDS[GHLFormType.PRE_QUAL],
    formName: 'Pre-Qualification Form',
    description: 'Quick pre-qualification to assess funding eligibility',
    endpoint: `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_IDS[GHLFormType.PRE_QUAL]}`,
    fieldMappings: {
      firstName: {
        fieldName: 'firstName',
        ghlFieldName: 'first_name',
        required: true,
        type: 'text',
      },
      lastName: {
        fieldName: 'lastName',
        ghlFieldName: 'last_name',
        required: true,
        type: 'text',
      },
      email: {
        fieldName: 'email',
        ghlFieldName: 'email',
        required: true,
        type: 'email',
      },
      phone: {
        fieldName: 'phone',
        ghlFieldName: 'phone',
        required: true,
        type: 'phone',
      },
      businessName: {
        fieldName: 'businessName',
        ghlFieldName: 'business_name',
        required: false,
        type: 'text',
      },
      businessType: {
        fieldName: 'businessType',
        ghlFieldName: 'business_type',
        required: false,
        type: 'select',
      },
      industry: {
        fieldName: 'industry',
        ghlFieldName: 'industry',
        required: false,
        type: 'text',
      },
      yearsInBusiness: {
        fieldName: 'yearsInBusiness',
        ghlFieldName: 'years_in_business',
        required: false,
        type: 'number',
      },
      annualRevenue: {
        fieldName: 'annualRevenue',
        ghlFieldName: 'annual_revenue',
        required: false,
        type: 'text',
      },
      loanAmount: {
        fieldName: 'loanAmount',
        ghlFieldName: 'loan_amount',
        required: false,
        type: 'text',
      },
      loanPurpose: {
        fieldName: 'loanPurpose',
        ghlFieldName: 'loan_purpose',
        required: false,
        type: 'text',
      },
      creditScore: {
        fieldName: 'creditScore',
        ghlFieldName: 'credit_score_range',
        required: false,
        type: 'select',
      },
      hasCollateral: {
        fieldName: 'hasCollateral',
        ghlFieldName: 'has_collateral',
        required: false,
        type: 'select',
      },
      serviceType: {
        fieldName: 'serviceType',
        ghlFieldName: 'service_type',
        required: true,
        type: 'select',
      },
    },
  },

  [GHLFormType.FULL_APPLICATION]: {
    formId: GHL_FORM_IDS[GHLFormType.FULL_APPLICATION],
    formName: 'Full Application',
    description: 'Complete funding application with comprehensive details',
    endpoint: `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_IDS[GHLFormType.FULL_APPLICATION]}`,
    fieldMappings: {
      firstName: {
        fieldName: 'firstName',
        ghlFieldName: 'first_name',
        required: true,
        type: 'text',
      },
      lastName: {
        fieldName: 'lastName',
        ghlFieldName: 'last_name',
        required: true,
        type: 'text',
      },
      email: {
        fieldName: 'email',
        ghlFieldName: 'email',
        required: true,
        type: 'email',
      },
      phone: {
        fieldName: 'phone',
        ghlFieldName: 'phone',
        required: true,
        type: 'phone',
      },
      businessName: {
        fieldName: 'businessName',
        ghlFieldName: 'business_name',
        required: true,
        type: 'text',
      },
      businessStructure: {
        fieldName: 'businessStructure',
        ghlFieldName: 'business_structure',
        required: false,
        type: 'select',
      },
      taxId: {
        fieldName: 'taxId',
        ghlFieldName: 'tax_id',
        required: false,
        type: 'text',
      },
      yearsInBusiness: {
        fieldName: 'yearsInBusiness',
        ghlFieldName: 'years_in_business',
        required: true,
        type: 'number',
      },
      monthlyRevenue: {
        fieldName: 'monthlyRevenue',
        ghlFieldName: 'monthly_revenue',
        required: true,
        type: 'text',
      },
      loanAmount: {
        fieldName: 'loanAmount',
        ghlFieldName: 'loan_amount',
        required: true,
        type: 'text',
      },
      loanPurpose: {
        fieldName: 'loanPurpose',
        ghlFieldName: 'loan_purpose',
        required: true,
        type: 'text',
      },
      businessAddress: {
        fieldName: 'businessAddress',
        ghlFieldName: 'business_address',
        required: true,
        type: 'text',
      },
      creditScore: {
        fieldName: 'creditScore',
        ghlFieldName: 'credit_score_range',
        required: false,
        type: 'select',
      },
      collateralType: {
        fieldName: 'collateralType',
        ghlFieldName: 'collateral_type',
        required: false,
        type: 'text',
      },
      collateralValue: {
        fieldName: 'collateralValue',
        ghlFieldName: 'collateral_value',
        required: false,
        type: 'text',
      },
    },
  },

  [GHLFormType.DOCUMENT_UPLOAD]: {
    formId: GHL_FORM_IDS[GHLFormType.DOCUMENT_UPLOAD],
    formName: 'Document Upload',
    description: 'Submit required documents for your application',
    endpoint: `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_IDS[GHLFormType.DOCUMENT_UPLOAD]}`,
    fieldMappings: {
      email: {
        fieldName: 'email',
        ghlFieldName: 'email',
        required: true,
        type: 'email',
      },
      documentType: {
        fieldName: 'documentType',
        ghlFieldName: 'document_type',
        required: true,
        type: 'select',
      },
      documentName: {
        fieldName: 'documentName',
        ghlFieldName: 'document_name',
        required: true,
        type: 'text',
      },
      notes: {
        fieldName: 'notes',
        ghlFieldName: 'notes',
        required: false,
        type: 'textarea',
      },
    },
  },

  [GHLFormType.INVESTMENT]: {
    formId: GHL_FORM_IDS[GHLFormType.INVESTMENT],
    formName: 'Investment Inquiry',
    description: 'Explore fixed return investment opportunities',
    endpoint: `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_IDS[GHLFormType.INVESTMENT]}`,
    fieldMappings: {
      firstName: {
        fieldName: 'firstName',
        ghlFieldName: 'first_name',
        required: true,
        type: 'text',
      },
      lastName: {
        fieldName: 'lastName',
        ghlFieldName: 'last_name',
        required: true,
        type: 'text',
      },
      email: {
        fieldName: 'email',
        ghlFieldName: 'email',
        required: true,
        type: 'email',
      },
      phone: {
        fieldName: 'phone',
        ghlFieldName: 'phone',
        required: true,
        type: 'phone',
      },
      investmentAmount: {
        fieldName: 'investmentAmount',
        ghlFieldName: 'investment_amount',
        required: true,
        type: 'text',
      },
      investmentTerm: {
        fieldName: 'investmentTerm',
        ghlFieldName: 'investment_term',
        required: false,
        type: 'select',
      },
      riskTolerance: {
        fieldName: 'riskTolerance',
        ghlFieldName: 'risk_tolerance',
        required: false,
        type: 'select',
      },
    },
  },

  [GHLFormType.REAL_ESTATE]: {
    formId: GHL_FORM_IDS[GHLFormType.REAL_ESTATE],
    formName: 'Real Estate Inquiry',
    description: 'Financing for real estate investments and projects',
    endpoint: `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_IDS[GHLFormType.REAL_ESTATE]}`,
    fieldMappings: {
      firstName: {
        fieldName: 'firstName',
        ghlFieldName: 'first_name',
        required: true,
        type: 'text',
      },
      lastName: {
        fieldName: 'lastName',
        ghlFieldName: 'last_name',
        required: true,
        type: 'text',
      },
      email: {
        fieldName: 'email',
        ghlFieldName: 'email',
        required: true,
        type: 'email',
      },
      phone: {
        fieldName: 'phone',
        ghlFieldName: 'phone',
        required: true,
        type: 'phone',
      },
      propertyType: {
        fieldName: 'propertyType',
        ghlFieldName: 'property_type',
        required: true,
        type: 'select',
      },
      propertyAddress: {
        fieldName: 'propertyAddress',
        ghlFieldName: 'property_address',
        required: true,
        type: 'text',
      },
      propertyValue: {
        fieldName: 'propertyValue',
        ghlFieldName: 'property_value',
        required: false,
        type: 'text',
      },
      loanAmount: {
        fieldName: 'loanAmount',
        ghlFieldName: 'loan_amount',
        required: true,
        type: 'text',
      },
      projectType: {
        fieldName: 'projectType',
        ghlFieldName: 'project_type',
        required: false,
        type: 'select',
      },
      timeline: {
        fieldName: 'timeline',
        ghlFieldName: 'timeline',
        required: false,
        type: 'select',
      },
    },
  },

  [GHLFormType.SVT_REGISTRATION]: {
    formId: GHL_FORM_IDS[GHLFormType.SVT_REGISTRATION],
    formName: 'SVT Registration',
    description: 'Register for the Saint Vision Training program',
    endpoint: `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_IDS[GHLFormType.SVT_REGISTRATION]}`,
    fieldMappings: {
      firstName: {
        fieldName: 'firstName',
        ghlFieldName: 'first_name',
        required: true,
        type: 'text',
      },
      lastName: {
        fieldName: 'lastName',
        ghlFieldName: 'last_name',
        required: true,
        type: 'text',
      },
      email: {
        fieldName: 'email',
        ghlFieldName: 'email',
        required: true,
        type: 'email',
      },
      phone: {
        fieldName: 'phone',
        ghlFieldName: 'phone',
        required: true,
        type: 'phone',
      },
      experience: {
        fieldName: 'experience',
        ghlFieldName: 'experience_level',
        required: false,
        type: 'select',
      },
    },
  },

  [GHLFormType.MORTGAGE]: {
    formId: GHL_FORM_IDS[GHLFormType.MORTGAGE],
    formName: 'Mortgage Application',
    description: 'Apply for competitive mortgage rates',
    endpoint: `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_IDS[GHLFormType.MORTGAGE]}`,
    fieldMappings: {
      firstName: {
        fieldName: 'firstName',
        ghlFieldName: 'first_name',
        required: true,
        type: 'text',
      },
      lastName: {
        fieldName: 'lastName',
        ghlFieldName: 'last_name',
        required: true,
        type: 'text',
      },
      email: {
        fieldName: 'email',
        ghlFieldName: 'email',
        required: true,
        type: 'email',
      },
      phone: {
        fieldName: 'phone',
        ghlFieldName: 'phone',
        required: true,
        type: 'phone',
      },
      propertyAddress: {
        fieldName: 'propertyAddress',
        ghlFieldName: 'property_address',
        required: true,
        type: 'text',
      },
      purchasePrice: {
        fieldName: 'purchasePrice',
        ghlFieldName: 'purchase_price',
        required: true,
        type: 'text',
      },
      downPayment: {
        fieldName: 'downPayment',
        ghlFieldName: 'down_payment',
        required: true,
        type: 'text',
      },
      loanTerm: {
        fieldName: 'loanTerm',
        ghlFieldName: 'loan_term',
        required: false,
        type: 'select',
      },
      creditScore: {
        fieldName: 'creditScore',
        ghlFieldName: 'credit_score_range',
        required: false,
        type: 'select',
      },
    },
  },
};

export function getFormConfig(formType: GHLFormType): GHLFormConfig {
  return GHL_FORM_CONFIGS[formType];
}

export function mapFormDataToGHL(formData: Record<string, any>, formType: GHLFormType): Record<string, any> {
  const config = getFormConfig(formType);
  const mappedData: Record<string, any> = {};

  Object.entries(formData).forEach(([key, value]) => {
    const mapping = config.fieldMappings[key];
    if (mapping && value !== undefined && value !== null && value !== '') {
      mappedData[mapping.ghlFieldName] = value;
    }
  });

  return mappedData;
}
