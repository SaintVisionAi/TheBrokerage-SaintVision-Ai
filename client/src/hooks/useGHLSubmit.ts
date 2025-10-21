import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GHLFormType, getFormConfig, mapFormDataToGHL } from '@/config/ghl-forms';

export interface GHLSubmitOptions {
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
}

export interface GHLSubmitResult {
  success: boolean;
  data?: any;
  error?: Error;
}

/**
 * Hook for submitting forms to GoHighLevel
 * Handles form data mapping, validation, and API submission
 */
export function useGHLSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const submit = useCallback(
    async (
      formType: GHLFormType,
      formData: Record<string, any>,
      options: GHLSubmitOptions = {}
    ): Promise<GHLSubmitResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const config = getFormConfig(formType);
        
        // Validate required fields
        const missingFields = Object.entries(config.fieldMappings)
          .filter(([key, mapping]) => mapping.required && !formData[key])
          .map(([key]) => key);

        if (missingFields.length > 0) {
          const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
          setError(error);
          if (options.showToast !== false) {
            toast({
              title: '❌ Validation Error',
              description: `Please fill in all required fields: ${missingFields.join(', ')}`,
              variant: 'destructive',
            });
          }
          if (options.onError) {
            options.onError(error);
          }
          return { success: false, error };
        }

        // Map form data to GHL field names
        const mappedData = mapFormDataToGHL(formData, formType);

        // Add service type if not already present
        if (!mappedData.service_type && formData.serviceType) {
          mappedData.service_type = formData.serviceType;
        }

        // Add source identifier
        if (!mappedData.source) {
          mappedData.source = 'SaintBroker AI - Client Hub';
        }

        // Get the endpoint from config
        const endpoint = config.endpoint;

        if (!endpoint) {
          throw new Error(`Form ID not configured for ${formType}. Please check your environment variables.`);
        }

        // Submit to GHL
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mappedData),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`GHL submission failed: ${response.statusText}. ${errorData}`);
        }

        const result = await response.json();

        if (options.showToast !== false) {
          toast({
            title: '✅ Form Submitted',
            description: `Your ${config.formName} has been successfully submitted to our system.`,
          });
        }

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        setIsLoading(false);
        return { success: true, data: result };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        if (options.showToast !== false) {
          toast({
            title: '❌ Submission Failed',
            description: error.message,
            variant: 'destructive',
          });
        }

        if (options.onError) {
          options.onError(error);
        }

        setIsLoading(false);
        return { success: false, error };
      }
    },
    [toast]
  );

  const submitWithValidation = useCallback(
    async (
      formType: GHLFormType,
      formData: Record<string, any>,
      customValidation?: (data: Record<string, any>) => string | null,
      options: GHLSubmitOptions = {}
    ): Promise<GHLSubmitResult> => {
      // Run custom validation if provided
      if (customValidation) {
        const validationError = customValidation(formData);
        if (validationError) {
          setError(new Error(validationError));
          if (options.showToast !== false) {
            toast({
              title: '❌ Validation Error',
              description: validationError,
              variant: 'destructive',
            });
          }
          return { success: false, error: new Error(validationError) };
        }
      }

      return submit(formType, formData, options);
    },
    [submit, toast]
  );

  return {
    submit,
    submitWithValidation,
    isLoading,
    error,
  };
}

/**
 * Helper function to validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper function to validate phone format (basic US format)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Helper function to validate loan amount
 */
export function validateLoanAmount(amount: string): boolean {
  const numAmount = parseInt(amount.replace(/\D/g, ''));
  return numAmount > 0 && numAmount <= 10000000; // Max $10M
}

/**
 * Combined validation for common form patterns
 */
export function createCommonValidation() {
  return (formData: Record<string, any>) => {
    if (formData.email && !validateEmail(formData.email)) {
      return 'Please enter a valid email address';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      return 'Please enter a valid phone number (at least 10 digits)';
    }

    if (formData.loanAmount && !validateLoanAmount(formData.loanAmount)) {
      return 'Please enter a loan amount between $1 and $10,000,000';
    }

    if (
      formData.yearsInBusiness &&
      (parseInt(formData.yearsInBusiness) < 0 || parseInt(formData.yearsInBusiness) > 100)
    ) {
      return 'Please enter a valid number of years in business';
    }

    return null;
  };
}
