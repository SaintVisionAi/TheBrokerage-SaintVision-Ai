import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface LeadData {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  loanAmount?: number;
  investmentAmount?: number;
  propertyType?: string;
  propertyValue?: number;
  loanPurpose?: string;
  businessRevenue?: number;
  yearsInBusiness?: number;
  creditScoreRange?: string;
  [key: string]: any;
}

export interface AIQualificationResult {
  division: 'investment' | 'real_estate' | 'lending';
  priority: 'hot' | 'warm' | 'cold';
  estimatedValue: number;
  nextSteps: string[];
  reasoning: string;
  confidenceScore: number;
}

export async function qualifyLead(leadData: LeadData): Promise<AIQualificationResult> {
  try {
    const prompt = `You are an AI lead qualification specialist for Saint Vision Group, a professional brokerage handling Investment, Real Estate, and Lending.

Analyze this lead and determine:
1. Division (investment, real_estate, or lending)
2. Priority (hot, warm, or cold)
3. Estimated deal value
4. Next 3 action steps
5. Reasoning for classification

QUALIFICATION CRITERIA:

INVESTMENT:
- Investment amount > $100k
- Accredited investor likely
- Investment timeline < 12 months
- HOT if: Amount > $500k OR existing relationship

REAL ESTATE:
- Buying or selling property
- Property type (residential/commercial)
- Budget/price range identified
- HOT if: Timeline "immediate" OR price > $1M

LENDING:
- Loan amount identified
- Credit score mentioned
- Property type (purchase/refinance)
- HOT if: Credit > 700 AND amount > $500k

Lead Data:
${JSON.stringify(leadData, null, 2)}

Respond in JSON format:
{
  "division": "investment|real_estate|lending",
  "priority": "hot|warm|cold",
  "estimatedValue": <number>,
  "nextSteps": ["step1", "step2", "step3"],
  "reasoning": "<brief explanation>",
  "confidenceScore": <0-100>
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a lead qualification AI for a professional brokerage. Respond only in valid JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    console.log('✅ AI Qualification:', {
      division: result.division,
      priority: result.priority,
      value: result.estimatedValue,
    });

    return result;
  } catch (error) {
    console.error('❌ AI Qualification failed:', error);
    
    // Fallback: Basic rule-based qualification
    const fallback = fallbackQualification(leadData);
    console.log('⚠️  Using fallback qualification:', fallback);
    return fallback;
  }
}

function fallbackQualification(leadData: LeadData): AIQualificationResult {
  const loanAmount = leadData.loanAmount || 0;
  const investmentAmount = leadData.investmentAmount || 0;
  const propertyValue = leadData.propertyValue || 0;
  
  // Determine division
  let division: 'investment' | 'real_estate' | 'lending' = 'lending';
  let estimatedValue = loanAmount;
  
  if (investmentAmount > 0) {
    division = 'investment';
    estimatedValue = investmentAmount;
  } else if (propertyValue > 0 || leadData.propertyType) {
    division = 'real_estate';
    estimatedValue = propertyValue || loanAmount;
  }
  
  // Determine priority
  let priority: 'hot' | 'warm' | 'cold' = 'warm';
  if (estimatedValue > 500000) {
    priority = 'hot';
  } else if (estimatedValue < 100000) {
    priority = 'cold';
  }
  
  // Next steps based on division
  const nextSteps = {
    investment: [
      'Send investment deck and welcome email',
      'Request KYC documents',
      'Schedule accreditation verification call',
    ],
    real_estate: [
      'Send property preferences form',
      'Conduct MLS search (buyer) or prepare CMA (seller)',
      'Schedule showing or listing consultation',
    ],
    lending: [
      'Send pre-qualification confirmation',
      'Request document checklist',
      'Authorize credit check',
    ],
  };
  
  return {
    division,
    priority,
    estimatedValue,
    nextSteps: nextSteps[division],
    reasoning: `Fallback classification based on ${division === 'investment' ? 'investment' : division === 'real_estate' ? 'property' : 'loan'} amount of $${estimatedValue}`,
    confidenceScore: 60,
  };
}
