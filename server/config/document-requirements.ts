// Document Requirements by Division
// Based on Saint Vision Group brokerage workflows

export interface DocumentRequirement {
  type: string;
  displayName: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
}

export const DOCUMENT_REQUIREMENTS: Record<string, DocumentRequirement[]> = {
  investment: [
    {
      type: 'government_id',
      displayName: 'Government-Issued ID',
      description: 'Valid driver\'s license, passport, or state ID',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf']
    },
    {
      type: 'accreditation_letter',
      displayName: 'Accreditation Letter',
      description: 'Letter from CPA, attorney, or broker verifying accredited investor status',
      required: true,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png']
    },
    {
      type: 'bank_statement',
      displayName: 'Bank Statement (Last 3 Months)',
      description: 'Most recent 3 months of bank statements',
      required: true,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png']
    },
    {
      type: 'tax_returns',
      displayName: 'Tax Returns (Last 2 Years)',
      description: 'Complete tax returns for the last 2 years',
      required: true,
      acceptedFormats: ['application/pdf']
    }
  ],
  
  real_estate: [
    {
      type: 'government_id',
      displayName: 'Government-Issued ID',
      description: 'Valid driver\'s license, passport, or state ID',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf']
    },
    {
      type: 'pre_approval_letter',
      displayName: 'Pre-Approval Letter',
      description: 'Mortgage pre-approval letter from lender',
      required: true,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png']
    },
    {
      type: 'bank_statement',
      displayName: 'Bank Statement',
      description: 'Most recent bank statement showing down payment funds',
      required: true,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png']
    },
    {
      type: 'employment_verification',
      displayName: 'Employment Verification',
      description: 'Recent paystub or employment letter',
      required: true,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png']
    }
  ],
  
  lending: [
    {
      type: 'government_id',
      displayName: 'Government-Issued ID',
      description: 'Valid driver\'s license, passport, or state ID',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf']
    },
    {
      type: 'paystubs',
      displayName: 'Paystubs (Last 2 Months)',
      description: 'Most recent 2 months of paystubs',
      required: true,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png']
    },
    {
      type: 'w2_forms',
      displayName: 'W-2 Forms (Last 2 Years)',
      description: 'W-2 forms for the last 2 years',
      required: true,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png']
    },
    {
      type: 'bank_statements',
      displayName: 'Bank Statements (Last 2 Months)',
      description: 'Most recent 2 months of bank statements',
      required: true,
      acceptedFormats: ['application/pdf', 'image/jpeg', 'image/png']
    },
    {
      type: 'tax_returns',
      displayName: 'Tax Returns (Last 2 Years)',
      description: 'Complete tax returns for the last 2 years',
      required: true,
      acceptedFormats: ['application/pdf']
    }
  ]
};

export function getRequiredDocuments(division: string): DocumentRequirement[] {
  return DOCUMENT_REQUIREMENTS[division] || [];
}

export function getDocumentTypes(division: string): string[] {
  return getRequiredDocuments(division).map(doc => doc.type);
}

export function validateFileType(division: string, documentType: string, mimeType: string): boolean {
  const doc = getRequiredDocuments(division).find(d => d.type === documentType);
  if (!doc) return false;
  return doc.acceptedFormats.includes(mimeType);
}
