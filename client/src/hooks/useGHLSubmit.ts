/**
 * useGHLSubmit Hook
 * Add this to your existing beautiful Saint Vision forms
 * Just drop it in and call it on form submit
 */

import { useState } from 'react';

export interface GHLFormData {
  [key: string]: string | number | boolean | File | null;
}

export const GHL_FORMS = {
  PRE_QUAL: 'gPGc1pTZGRvxybqPpDRL',
  FULL_APPLICATION: '0zcz0ZlG2eEddg94wcbq',
  DOC_UPLOAD: 'yLjMJMuW3mM08ju9GkWY',
  INVESTMENT: '1pivHofKUp5uTa9ws1TG',
  REAL_ESTATE: 'M2jNYXh8wl8FYhxOap9N',
  SVT_REGISTRATION: 'BmPNIXxZcCjsVhFTVddI',
  MORTGAGE: 'nYhOnZmZP1mH1MWGLNBd'
} as const;

/**
 * Hook to submit form data to GoHighLevel
 * Use this in your existing form components
 */
export function useGHLSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitToGHL = async (
    formId: string,
    formData: GHLFormData
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // GHL form submission endpoint
      const endpoint = `https://api.leadconnectorhq.com/widget/form/${formId}`;

      // Convert to FormData
      const submitData = new FormData();
      
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
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      return { success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Submission failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitToGHL, isSubmitting, error };
}
