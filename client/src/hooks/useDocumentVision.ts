import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DocumentAnalysis {
  documentType: string;
  status: 'valid' | 'invalid' | 'warning' | 'unknown';
  confidence: number;
  summary: string;
  keyFields: Array<{ label: string; value: string }>;
  issues: string[];
  recommendations: string[];
  extractedData: Record<string, any>;
}

/**
 * Hook for analyzing documents using Azure Vision or Gemini
 * Provides OCR, document classification, and data extraction
 */
export function useDocumentVision() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const analyzeDocument = useCallback(
    async (file: File | string): Promise<DocumentAnalysis | null> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        let fileData: string | File = file;

        // If string (URL), fetch the file first
        if (typeof file === 'string') {
          try {
            const response = await fetch(file);
            const blob = await response.blob();
            fileData = new File([blob], 'document', { type: blob.type });
          } catch (err) {
            throw new Error(`Failed to fetch document from URL: ${err}`);
          }
        }

        // Convert file to base64 if needed
        let base64Data: string | null = null;
        if (fileData instanceof File) {
          base64Data = await fileToBase64(fileData);
        }

        if (!base64Data) {
          throw new Error('Failed to process document');
        }

        // Send to backend for vision analysis
        const response = await fetch('/api/vision/analyze-document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            document: base64Data,
            documentType: typeof fileData === 'string' ? undefined : (fileData as File).type,
          }),
        });

        if (!response.ok) {
          throw new Error('Vision analysis failed');
        }

        const analysis: DocumentAnalysis = await response.json();
        setIsAnalyzing(false);

        toast({
          title: '✅ Document Analyzed',
          description: `Document classified as ${analysis.documentType}`,
        });

        return analysis;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setIsAnalyzing(false);

        toast({
          title: '❌ Analysis Failed',
          description: error.message,
          variant: 'destructive',
        });

        return null;
      }
    },
    [toast]
  );

  const extractText = useCallback(
    async (file: File | string): Promise<string | null> => {
      try {
        const analysis = await analyzeDocument(file);
        return analysis?.summary || null;
      } catch (err) {
        console.error('Failed to extract text:', err);
        return null;
      }
    },
    [analyzeDocument]
  );

  const validateDocument = useCallback(
    async (file: File | string, expectedType: string): Promise<boolean> => {
      try {
        const analysis = await analyzeDocument(file);
        return analysis?.documentType.toLowerCase() === expectedType.toLowerCase();
      } catch (err) {
        console.error('Failed to validate document:', err);
        return false;
      }
    },
    [analyzeDocument]
  );

  return {
    analyzeDocument,
    extractText,
    validateDocument,
    isAnalyzing,
    error,
  };
}

/**
 * Convert File to Base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Classify document type using heuristics
 */
export function classifyDocumentByName(filename: string): string {
  const lower = filename.toLowerCase();

  if (lower.includes('tax') || lower.includes('1040') || lower.includes('form1040')) {
    return 'Tax Return';
  }
  if (lower.includes('bank') || lower.includes('statement')) {
    return 'Bank Statement';
  }
  if (lower.includes('paystub') || lower.includes('pay stub')) {
    return 'Pay Stub';
  }
  if (lower.includes('license') || lower.includes('id')) {
    return 'Government ID';
  }
  if (lower.includes('utility') || lower.includes('bill')) {
    return 'Utility Bill';
  }
  if (lower.includes('lease') || lower.includes('rental')) {
    return 'Lease Agreement';
  }
  if (lower.includes('contract') || lower.includes('agreement')) {
    return 'Contract';
  }
  if (lower.includes('invoice') || lower.includes('receipt')) {
    return 'Invoice';
  }

  return 'Document';
}
