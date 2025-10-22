import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export interface SaintSalMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SaintSalAction {
  type: 'button' | 'link';
  text: string;
  url?: string;
  onClick?: string;
  primary?: boolean;
  variant?: 'default' | 'secondary' | 'destructive';
}

export interface SaintSalResponse {
  success: boolean;
  response: string;
  model: string;
  latencyMs: number;
  tokensUsed: number;
  actions?: SaintSalAction[];
  analysis?: {
    intent: string;
    qualified: boolean;
    needsFollowUp: boolean;
    urgency: 'low' | 'medium' | 'high';
  };
}

class SaintSalAI {
  private anthropic: Anthropic;
  private google: GoogleGenerativeAI;
  private openai: OpenAI;
  private azureOpenai: OpenAI;

  private systemPrompt = `You are SaintSal™, an elite AI loan officer and financial advisor with 20+ years of industry expertise. 
  
Your personality: You're Sal Couzzo - friendly, knowledgeable, professional, and results-oriented. You know lending inside and out.

Your role:
- Qualify leads for business loans ($50K-$5M)
- Discuss real estate financing solutions
- Explain investment opportunities (9-12% returns)
- Answer questions about rates, terms, and approval process
- Build rapport and move conversations toward applications

Key knowledge:
- Business Lending: $50K-$5M, starting at 7.99%, 24-48 hour approval
- Real Estate: Fix & Flip, DSCR, Bridge Loans, Cash-Out Refi
- Investments: 9-12% annual returns, diversified portfolios
- NO collateral required for qualified borrowers
- Multiple funding partners for flexible terms

Always:
- Be warm, conversational, and helpful
- Qualify early (ask about credit score, business revenue, loan amount)
- Explain benefits and next steps
- Ask clarifying questions to understand their specific needs
- Guide toward applications when appropriate`;

  constructor() {
    // Initialize all AI clients with your API keys
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    this.google = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.azureOpenai = new OpenAI({
      apiKey: process.env.AZURE_AI_FOUNDRY_KEY,
      baseURL: `${process.env.AZURE_AI_FOUNDRY_ENDPOINT}/deployments/${process.env.AZURE_DEPLOYMENT_GPT5_CORE}/chat/completions?api-version=2024-08-01-preview`,
      defaultHeaders: {
        'api-key': process.env.AZURE_AI_FOUNDRY_KEY
      }
    });
  }

  async chat(userId: string, userMessage: string): Promise<SaintSalResponse> {
    const startTime = Date.now();

    // Try Azure first (primary)
    try {
      console.log('🤖 SaintSal: Trying Azure GPT-5...');
      const response = await this.callAzure([
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: userMessage }
      ]);
      
      const latency = Date.now() - startTime;
      return {
        success: true,
        response: response.content,
        model: 'Azure GPT-5',
        latencyMs: latency,
        tokensUsed: response.tokens,
        analysis: this.analyzeIntent(userMessage, response.content)
      };
    } catch (error) {
      console.warn('⚠️ Azure failed, trying Claude...');
    }

    // Fallback to Claude (backup)
    try {
      console.log('🤖 SaintSal: Trying Claude Sonnet 4...');
      const response = await this.callClaude([
        { role: 'user', content: this.systemPrompt + '\n\n' + userMessage }
      ]);
      
      const latency = Date.now() - startTime;
      return {
        success: true,
        response: response.content,
        model: 'Claude Sonnet 4',
        latencyMs: latency,
        tokensUsed: response.tokens,
        analysis: this.analyzeIntent(userMessage, response.content)
      };
    } catch (error) {
      console.warn('⚠️ Claude failed, trying Gemini...');
    }

    // Fallback to Gemini (tertiary)
    try {
      console.log('🤖 SaintSal: Trying Gemini Pro...');
      const response = await this.callGemini(userMessage);
      
      const latency = Date.now() - startTime;
      return {
        success: true,
        response: response.content,
        model: 'Gemini Pro',
        latencyMs: latency,
        tokensUsed: response.tokens,
        analysis: this.analyzeIntent(userMessage, response.content)
      };
    } catch (error) {
      console.warn('⚠�� Gemini failed, trying OpenAI...');
    }

    // Final fallback to OpenAI
    try {
      console.log('🤖 SaintSal: Trying OpenAI GPT-4...');
      const response = await this.callOpenAI([
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: userMessage }
      ]);
      
      const latency = Date.now() - startTime;
      return {
        success: true,
        response: response.content,
        model: 'OpenAI GPT-4',
        latencyMs: latency,
        tokensUsed: response.tokens,
        analysis: this.analyzeIntent(userMessage, response.content)
      };
    } catch (error) {
      console.error('❌ All AI models failed:', error);
      
      const latency = Date.now() - startTime;
      return {
        success: false,
        response: "I'm experiencing technical difficulties, but I'm here to help! Please call us at (949) 997-2097 or visit saintvisionai.com to continue.",
        model: 'Fallback',
        latencyMs: latency,
        tokensUsed: 0
      };
    }
  }

  private async callAzure(
    messages: SaintSalMessage[]
  ): Promise<{ content: string; tokens: number }> {
    const response = await this.azureOpenai.chat.completions.create({
      model: process.env.AZURE_DEPLOYMENT_GPT5_CORE || 'gpt-5-core',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || '';
    const tokens = response.usage?.total_tokens || 0;

    return { content, tokens };
  }

  private async callClaude(
    messages: SaintSalMessage[]
  ): Promise<{ content: string; tokens: number }> {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: this.systemPrompt,
      messages: messages.filter(m => m.role !== 'system') as any,
    });

    const content = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const tokens = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    return { content, tokens };
  }

  private async callGemini(
    userMessage: string
  ): Promise<{ content: string; tokens: number }> {
    const model = this.google.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const response = await model.generateContent(
      this.systemPrompt + '\n\n' + userMessage
    );

    const content = response.response.text();
    // Gemini doesn't provide token counts in the standard response
    const tokens = Math.ceil(content.length / 4);

    return { content, tokens };
  }

  private async callOpenAI(
    messages: SaintSalMessage[]
  ): Promise<{ content: string; tokens: number }> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || '';
    const tokens = response.usage?.total_tokens || 0;

    return { content, tokens };
  }

  private analyzeIntent(
    userMessage: string,
    response: string
  ): SaintSalResponse['analysis'] {
    const lowerMessage = userMessage.toLowerCase();

    // Determine intent
    let intent = 'inquiry';
    if (
      lowerMessage.includes('apply') ||
      lowerMessage.includes('start') ||
      lowerMessage.includes('submit')
    ) {
      intent = 'apply';
    } else if (
      lowerMessage.includes('approve') ||
      lowerMessage.includes('qualify') ||
      lowerMessage.includes('eligible')
    ) {
      intent = 'qualification';
    } else if (
      lowerMessage.includes('rate') ||
      lowerMessage.includes('term') ||
      lowerMessage.includes('cost')
    ) {
      intent = 'pricing';
    }

    // Determine if qualified (basic scoring)
    const hasLoanAmount = /\$\d+[kmKM]?/.test(userMessage);
    const hasIndustry = /business|company|store|shop|restaurant|agency/i.test(userMessage);
    const hasCreditScore = /\d{3}/.test(userMessage);
    const qualified = hasLoanAmount || hasIndustry;

    // Determine urgency
    let urgency: 'low' | 'medium' | 'high' = 'medium';
    if (
      lowerMessage.includes('urgent') ||
      lowerMessage.includes('asap') ||
      lowerMessage.includes('fast') ||
      lowerMessage.includes('immediately')
    ) {
      urgency = 'high';
    } else if (
      lowerMessage.includes('no rush') ||
      lowerMessage.includes('eventually') ||
      lowerMessage.includes('just looking')
    ) {
      urgency = 'low';
    }

    return {
      intent,
      qualified,
      needsFollowUp: !hasIndustry || !hasCreditScore,
      urgency
    };
  }
}

// Export singleton instance
export const saintSal = new SaintSalAI();
