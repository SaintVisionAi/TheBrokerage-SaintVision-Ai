import express from 'express';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

interface DocumentAnalysis {
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
 * POST /api/vision/analyze-document
 * Analyze a document using Azure Vision or Gemini
 * Provides OCR, classification, and data extraction
 */
router.post('/analyze-document', isAuthenticated, async (req, res) => {
  try {
    const { document, documentType } = req.body;

    if (!document) {
      return res.status(400).json({ error: 'Document data required' });
    }

    // Determine which vision service to use
    const useGemini = process.env.GEMINI_API_KEY && !process.env.AZURE_VISION_KEY;
    const useAzure = process.env.AZURE_VISION_KEY;

    let analysis: DocumentAnalysis;

    if (useGemini) {
      analysis = await analyzeWithGemini(document, documentType);
    } else if (useAzure) {
      analysis = await analyzeWithAzure(document, documentType);
    } else {
      return res.status(500).json({
        error: 'Vision service not configured',
        message: 'Please configure GEMINI_API_KEY or AZURE_VISION_KEY',
      });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing document:', error);
    res.status(500).json({
      error: 'Document analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/vision/extract-text
 * Extract text from a document
 */
router.post('/extract-text', isAuthenticated, async (req, res) => {
  try {
    const { document } = req.body;

    if (!document) {
      return res.status(400).json({ error: 'Document data required' });
    }

    const useGemini = process.env.GEMINI_API_KEY && !process.env.AZURE_VISION_KEY;
    const useAzure = process.env.AZURE_VISION_KEY;

    let text: string;

    if (useGemini) {
      text = await extractTextWithGemini(document);
    } else if (useAzure) {
      text = await extractTextWithAzure(document);
    } else {
      return res.status(500).json({
        error: 'Vision service not configured',
      });
    }

    res.json({ text });
  } catch (error) {
    console.error('Error extracting text:', error);
    res.status(500).json({
      error: 'Text extraction failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/vision/validate-document
 * Validate a document matches expected type
 */
router.post('/validate-document', isAuthenticated, async (req, res) => {
  try {
    const { document, expectedType } = req.body;

    if (!document || !expectedType) {
      return res.status(400).json({ error: 'Document and expectedType required' });
    }

    const analysis = await (process.env.GEMINI_API_KEY
      ? analyzeWithGemini(document, expectedType)
      : analyzeWithAzure(document, expectedType));

    const isValid = analysis.documentType.toLowerCase() === expectedType.toLowerCase();

    res.json({
      isValid,
      detectedType: analysis.documentType,
      confidence: analysis.confidence,
      status: analysis.status,
    });
  } catch (error) {
    console.error('Error validating document:', error);
    res.status(500).json({
      error: 'Document validation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Helper Functions

async function analyzeWithGemini(base64Data: string, documentType?: string): Promise<DocumentAnalysis> {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze this document image and provide a detailed analysis. 
                ${documentType ? `Expected document type: ${documentType}` : ''}
                
                Please respond in JSON format with the following structure:
                {
                  "documentType": "string (identified document type)",
                  "status": "valid|invalid|warning|unknown",
                  "confidence": number (0-100),
                  "summary": "brief description of document",
                  "keyFields": [{"label": "field name", "value": "extracted value"}],
                  "issues": ["list of issues found"],
                  "recommendations": ["improvement recommendations"],
                  "extractedData": {extracted data object}
                }`,
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : parseGeminiResponse(content);

    return {
      documentType: analysis.documentType || 'Unknown',
      status: analysis.status || 'unknown',
      confidence: analysis.confidence || 50,
      summary: analysis.summary || 'Document analyzed',
      keyFields: analysis.keyFields || [],
      issues: analysis.issues || [],
      recommendations: analysis.recommendations || [],
      extractedData: analysis.extractedData || {},
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

async function analyzeWithAzure(base64Data: string, documentType?: string): Promise<DocumentAnalysis> {
  try {
    const endpoint = process.env.AZURE_VISION_ENDPOINT;
    const key = process.env.AZURE_VISION_KEY;

    if (!endpoint || !key) {
      throw new Error('Azure Vision credentials not configured');
    }

    // Use Azure Document Intelligence for better document analysis
    const response = await fetch(`${endpoint}/documentintelligence/analyzeDocument?api-version=2024-02-29-preview`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/octet-stream',
      },
      body: Buffer.from(base64Data, 'base64'),
    });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      documentType: classifyAzureDocument(data),
      status: data.status === 'succeeded' ? 'valid' : 'warning',
      confidence: 85,
      summary: extractAzureSummary(data),
      keyFields: extractAzureFields(data),
      issues: [],
      recommendations: [],
      extractedData: data,
    };
  } catch (error) {
    console.error('Azure analysis error:', error);
    throw error;
  }
}

async function extractTextWithGemini(base64Data: string): Promise<string> {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Extract all text from this document image. Return only the extracted text without any additional commentary.',
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini text extraction error:', error);
    throw error;
  }
}

async function extractTextWithAzure(base64Data: string): Promise<string> {
  try {
    const endpoint = process.env.AZURE_VISION_ENDPOINT;
    const key = process.env.AZURE_VISION_KEY;

    if (!endpoint || !key) {
      throw new Error('Azure Vision credentials not configured');
    }

    const response = await fetch(`${endpoint}/vision/v3.2/read/analyzeImage`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/octet-stream',
      },
      body: Buffer.from(base64Data, 'base64'),
    });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.readResult?.blocks?.map((block: any) => block.lines?.map((line: any) => line.text).join('\n')).join('\n\n') || '';
  } catch (error) {
    console.error('Azure text extraction error:', error);
    throw error;
  }
}

// Helper parsing functions

function parseGeminiResponse(text: string): Partial<DocumentAnalysis> {
  const analysis: Partial<DocumentAnalysis> = {};

  if (text.includes('tax return') || text.includes('form 1040')) {
    analysis.documentType = 'Tax Return';
  } else if (text.includes('bank') || text.includes('statement')) {
    analysis.documentType = 'Bank Statement';
  } else if (text.includes('pay stub') || text.includes('paystub')) {
    analysis.documentType = 'Pay Stub';
  } else if (text.includes('id') || text.includes('license')) {
    analysis.documentType = 'Government ID';
  } else if (text.includes('utility') || text.includes('bill')) {
    analysis.documentType = 'Utility Bill';
  } else {
    analysis.documentType = 'Document';
  }

  analysis.status = 'valid';
  analysis.confidence = 75;

  return analysis;
}

function classifyAzureDocument(data: any): string {
  const text = data.readResult?.blocks?.[0]?.text || '';
  const lower = text.toLowerCase();

  if (lower.includes('tax') || lower.includes('1040')) {
    return 'Tax Return';
  }
  if (lower.includes('bank') || lower.includes('statement')) {
    return 'Bank Statement';
  }
  if (lower.includes('pay stub') || lower.includes('paystub')) {
    return 'Pay Stub';
  }

  return 'Document';
}

function extractAzureSummary(data: any): string {
  const blocks = data.readResult?.blocks || [];
  if (blocks.length === 0) return 'Document analyzed';

  const firstLines = blocks
    .slice(0, 3)
    .flatMap((block: any) => block.lines?.map((line: any) => line.text))
    .join(' ')
    .substring(0, 200);

  return firstLines + '...';
}

function extractAzureFields(data: any): Array<{ label: string; value: string }> {
  const fields: Array<{ label: string; value: string }> = [];

  const blocks = data.readResult?.blocks || [];
  blocks.forEach((block: any) => {
    block.lines?.slice(0, 5).forEach((line: any) => {
      if (line.text.length > 5) {
        fields.push({
          label: `Field ${fields.length + 1}`,
          value: line.text.substring(0, 100),
        });
      }
    });
  });

  return fields;
}

export default router;
