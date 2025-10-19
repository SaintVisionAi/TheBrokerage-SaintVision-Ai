import { z } from 'zod';
import { isValidBase64 } from './encryption';

// Application submission validation schema
export const applicationSubmitSchema = z.object({
  applicationData: z.object({
    // Business Information
    businessName: z.string().min(1, 'Business name is required'),
    ein: z.string().optional(),
    businessType: z.string().min(1, 'Business type is required'),
    yearsInBusiness: z.string().min(1, 'Years in business is required'),
    monthlyRevenue: z.string().min(1, 'Monthly revenue is required'),
    businessTitle: z.string().optional(),
    
    // Personal Information
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    ssn: z.string().optional(),
    creditScore: z.string().optional(),
    
    // Loan Details
    loanProduct: z.string().min(1, 'Loan product is required'),
    loanAmount: z.string().min(1, 'Loan amount is required'),
    loanPurpose: z.string().min(1, 'Loan purpose is required'),
    loanType: z.string().optional(),
    
    // Optional fields
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional()
  }),
  
  signatureData: z.object({
    data: z.string().refine((val) => {
      // Check if it's a valid base64 image or signature data
      return val && (val.startsWith('data:image/') || isValidBase64(val));
    }, 'Invalid signature data format'),
    type: z.enum(['drawn', 'typed']).optional().default('drawn')
  }),
  
  consentChecks: z.object({
    creditCheck: z.boolean().refine(val => val === true, {
      message: 'Credit check consent is required'
    }),
    businessVerification: z.boolean().refine(val => val === true, {
      message: 'Business verification consent is required'
    }),
    termsAcceptance: z.boolean().refine(val => val === true, {
      message: 'Terms acceptance is required'
    }),
    privacyPolicy: z.boolean().refine(val => val === true, {
      message: 'Privacy policy acceptance is required'
    })
  }),
  
  loanProductId: z.string().optional()
});

// Sanitize input to prevent injection attacks
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove any potential SQL injection patterns
    return input
      .replace(/['";\\]/g, '') // Remove quotes and backslashes
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]+>/g, '') // Remove HTML tags
      .trim();
  }
  
  if (typeof input === 'object' && input !== null) {
    if (Array.isArray(input)) {
      return input.map(sanitizeInput);
    }
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// Validate SSN format (US Social Security Number)
export function isValidSSN(ssn: string): boolean {
  if (!ssn) return false;
  
  // Remove any formatting
  const cleaned = ssn.replace(/\D/g, '');
  
  // Must be exactly 9 digits
  if (cleaned.length !== 9) return false;
  
  // Cannot be all zeros or all the same digit
  if (/^0+$/.test(cleaned) || /^(\d)\1+$/.test(cleaned)) return false;
  
  // Cannot start with 9 or 666 (invalid SSN prefixes)
  if (cleaned.startsWith('9') || cleaned.startsWith('666')) return false;
  
  // Area number (first 3 digits) cannot be 000
  if (cleaned.substring(0, 3) === '000') return false;
  
  // Group number (middle 2 digits) cannot be 00
  if (cleaned.substring(3, 5) === '00') return false;
  
  // Serial number (last 4 digits) cannot be 0000
  if (cleaned.substring(5) === '0000') return false;
  
  return true;
}

// Validate EIN format (Employer Identification Number)
export function isValidEIN(ein: string): boolean {
  if (!ein) return false;
  
  // Remove any formatting
  const cleaned = ein.replace(/\D/g, '');
  
  // Must be exactly 9 digits
  if (cleaned.length !== 9) return false;
  
  // EIN prefixes must be valid (01-99 except some reserved)
  const prefix = parseInt(cleaned.substring(0, 2));
  const invalidPrefixes = [7, 8, 9, 17, 18, 19, 28, 29, 41, 42, 43, 44, 45, 46, 47, 48, 49, 60, 67, 68, 69, 70, 78, 79, 89];
  
  if (prefix < 1 || prefix > 99 || invalidPrefixes.includes(prefix)) {
    return false;
  }
  
  return true;
}

// Validate phone number (basic US format)
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  
  // Remove any formatting
  const cleaned = phone.replace(/\D/g, '');
  
  // Must be 10 or 11 digits (with or without country code)
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}

// Validate credit score range
export function isValidCreditScore(score: string | number): boolean {
  const numScore = typeof score === 'string' ? parseInt(score) : score;
  return !isNaN(numScore) && numScore >= 300 && numScore <= 850;
}

export type ApplicationSubmitData = z.infer<typeof applicationSubmitSchema>;