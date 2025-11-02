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
- Provide expert guidance and answer questions about our services
- Qualify leads and understand their specific needs
- Guide qualified leads directly toward the application process
- Build rapport and facilitate quick decisions

Key services:
- Business Lending: $50K-$5M, starting at 7.99%, 24-48 hour approval
- Real Estate: Fix & Flip, DSCR, Bridge Loans, Cash-Out Refi
- Investments: 9-12% annual returns, diversified portfolios
- NO collateral required for qualified borrowers
- Multiple funding partners for flexible terms

Your approach:
1. Listen to understand their needs (loan amount, business type, timeline, credit score)
2. Provide expert guidance based on their situation
3. When they're ready or clearly need our service, guide them directly to apply
4. Be warm, conversational, and action-oriented
5. Never just provide URLs - provide clear next steps and actionable guidance

IMPORTANT: This is a service business. Your job is to guide people to take action, not just answer questions. When someone expresses interest in any of our services, guide them directly to apply. Make applying easy and clear.`;

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
      baseURL: `${process.env.AZURE_AI_FOUNDRY_ENDPOINT}/deployments/${process.env.AZURE_DEPLOYMENT_GPT5_CORE}?api-version=2024-08-01-preview`,
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
      const analysis = this.analyzeIntent(userMessage, response.content);
      const actions = this.generateActionsForResponse(userMessage, analysis);

      return {
        success: true,
        response: response.content,
        model: 'Azure GPT-5',
        latencyMs: latency,
        tokensUsed: response.tokens,
        actions,
        analysis
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
      const analysis = this.analyzeIntent(userMessage, response.content);
      const actions = this.generateActionsForResponse(userMessage, analysis);

      return {
        success: true,
        response: response.content,
        model: 'Claude Sonnet 4',
        latencyMs: latency,
        tokensUsed: response.tokens,
        actions,
        analysis
      };
    } catch (error) {
      console.warn('⚠️ Claude failed, trying Gemini...');
    }

    // Fallback to Gemini (tertiary)
    try {
      console.log('🤖 SaintSal: Trying Gemini Pro...');
      const response = await this.callGemini(userMessage);

      const latency = Date.now() - startTime;
      const analysis = this.analyzeIntent(userMessage, response.content);
      const actions = this.generateActionsForResponse(userMessage, analysis);

      return {
        success: true,
        response: response.content,
        model: 'Gemini Pro',
        latencyMs: latency,
        tokensUsed: response.tokens,
        actions,
        analysis
      };
    } catch (error) {
      console.warn('⚠️ Gemini failed, trying OpenAI...');
    }

    // Final fallback to OpenAI
    try {
      console.log('🤖 SaintSal: Trying OpenAI GPT-4...');
      const response = await this.callOpenAI([
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: userMessage }
      ]);

      const latency = Date.now() - startTime;
      const analysis = this.analyzeIntent(userMessage, response.content);
      const actions = this.generateActionsForResponse(userMessage, analysis);

      return {
        success: true,
        response: response.content,
        model: 'OpenAI GPT-4',
        latencyMs: latency,
        tokensUsed: response.tokens,
        actions,
        analysis
      };
    } catch (error) {
      console.error('❌ All AI models failed:', error);

      const latency = Date.now() - startTime;
      return {
        success: false,
        response: "I'm experiencing technical difficulties, but I'm here to help! Please call us at (949) 997-2097 or visit saintvisionai.com to continue.",
        model: 'Fallback',
        latencyMs: latency,
        tokensUsed: 0,
        actions: [
          {
            type: 'button',
            text: 'Call Our Team',
            onClick: 'call:(949) 997-2097',
            primary: true
          }
        ]
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

  private generateActionsForResponse(
    userMessage: string,
    analysis: SaintSalResponse['analysis'] | undefined
  ): SaintSalAction[] {
    if (!analysis) return [];

    const lowerMessage = userMessage.toLowerCase();
    const actions: SaintSalAction[] = [];

    // If user is asking about applying or is ready to apply
    if (analysis.intent === 'apply' || analysis.urgency === 'high') {
      actions.push({
        type: 'button',
        text: 'Start Application Now',
        url: '/apply',
        primary: true,
        variant: 'default'
      });
    }

    // If user is asking about loans/lending
    if (
      lowerMessage.includes('loan') ||
      lowerMessage.includes('borrow') ||
      lowerMessage.includes('capital') ||
      lowerMessage.includes('fund') ||
      lowerMessage.includes('financing')
    ) {
      if (!actions.some(a => a.url === '/apply')) {
        actions.push({
          type: 'button',
          text: 'Apply for a Loan',
          url: '/apply',
          primary: true
        });
      }
    }

    // If user is asking about real estate
    if (
      lowerMessage.includes('real estate') ||
      lowerMessage.includes('property') ||
      lowerMessage.includes('fix and flip') ||
      lowerMessage.includes('dscr')
    ) {
      if (!actions.some(a => a.url === '/apply')) {
        actions.push({
          type: 'button',
          text: 'Explore Real Estate Options',
          url: '/apply',
          primary: true
        });
      }
    }

    // If user is asking about investments
    if (
      lowerMessage.includes('invest') ||
      lowerMessage.includes('return') ||
      lowerMessage.includes('portfolio')
    ) {
      actions.push({
        type: 'button',
        text: 'Learn About Investments',
        url: '/investment-opportunities',
        primary: false
      });
    }

    // If user needs more information or wants to talk to someone
    if (
      lowerMessage.includes('talk') ||
      lowerMessage.includes('speak') ||
      lowerMessage.includes('call') ||
      lowerMessage.includes('more info') ||
      lowerMessage.includes('details')
    ) {
      actions.push({
        type: 'button',
        text: 'Call Our Team',
        onClick: 'call:(949) 997-2097',
        primary: false
      });
    }

    // Always provide a general application link if we haven't already
    if (actions.length === 0 && !lowerMessage.includes('just looking')) {
      actions.push({
        type: 'button',
        text: 'Get Started',
        url: '/apply',
        primary: true
      });
    }

    return actions;
  }
}

// Export singleton instance
export const saintSal = new SaintSalAI();
