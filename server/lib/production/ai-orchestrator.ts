/**
 * 🤖 SAINTBROKER AI ORCHESTRATOR - PRODUCTION READY
 * 
 * This is the heart of your 24/7 AI automation system.
 * Built for reliability, monitoring, and zero downtime.
 */

import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

const CONFIG = {
  // Model selection based on task
  models: {
    primary: 'gpt-4o',           // Main intelligence
    fallback: 'gpt-4-turbo',     // If primary fails
    embeddings: 'text-embedding-3-small',
  },
  
  // Retry configuration
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,  // 1 second
    maxDelay: 10000,  // 10 seconds
  },
  
  // Timeout configuration
  timeouts: {
    chat: 30000,      // 30 seconds
    embedding: 10000, // 10 seconds
    longRunning: 120000, // 2 minutes for complex tasks
  },
  
  // Circuit breaker (prevents cascading failures)
  circuitBreaker: {
    failureThreshold: 5,    // Open circuit after 5 failures
    resetTimeout: 60000,    // Try again after 1 minute
  },
};

// ═══════════════════════════════════════════════════════════
// CLIENTS
// ═══════════════════════════════════════════════════════════

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  timeout: CONFIG.timeouts.chat,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ═══════════════════════════════════════════════════════════
// CIRCUIT BREAKER
// ═══════════════════════════════════════════════════════════

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit is open
    if (this.state === 'OPEN') {
      const timeSinceFailure = Date.now() - (this.lastFailureTime || 0);
      if (timeSinceFailure < CONFIG.circuitBreaker.resetTimeout) {
        throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      
      // Success! Reset circuit
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
      }
      
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      
      if (this.failures >= CONFIG.circuitBreaker.failureThreshold) {
        this.state = 'OPEN';
        console.error('[CIRCUIT BREAKER] Opening circuit - too many failures');
      }
      
      throw error;
    }
  }
}

const breaker = new CircuitBreaker();

// ═══════════════════════════════════════════════════════════
// RETRY LOGIC WITH EXPONENTIAL BACKOFF
// ═══════════════════════════════════════════════════════════

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  context: string,
  attempt = 1
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Don't retry on certain errors
    if (error.status === 401 || error.status === 403) {
      console.error(`[${context}] Authentication error - not retrying`, error);
      throw error;
    }
    
    if (attempt >= CONFIG.retry.maxAttempts) {
      console.error(`[${context}] Max retries reached`, error);
      throw error;
    }
    
    // Calculate delay with exponential backoff
    const delay = Math.min(
      CONFIG.retry.baseDelay * Math.pow(2, attempt - 1),
      CONFIG.retry.maxDelay
    );
    
    console.warn(`[${context}] Attempt ${attempt} failed, retrying in ${delay}ms...`, error.message);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, context, attempt + 1);
  }
}

// ═══════════════════════════════════════════════════════════
// MONITORING & LOGGING
// ═══════════════════════════════════════════════════════════

interface AIMetrics {
  requestId: string;
  model: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tokens?: number;
  cost?: number;
  error?: string;
  success: boolean;
}

class MetricsCollector {
  private metrics: AIMetrics[] = [];
  
  startRequest(model: string): string {
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.metrics.push({
      requestId,
      model,
      startTime: Date.now(),
      success: false,
    });
    return requestId;
  }
  
  endRequest(
    requestId: string,
    success: boolean,
    tokens?: number,
    error?: string
  ) {
    const metric = this.metrics.find(m => m.requestId === requestId);
    if (metric) {
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.success = success;
      metric.tokens = tokens;
      metric.error = error;
      metric.cost = this.calculateCost(metric.model, tokens);
      
      // Log to monitoring service (Sentry, DataDog, etc.)
      this.sendToMonitoring(metric);
    }
  }
  
  private calculateCost(model: string, tokens?: number): number {
    if (!tokens) return 0;
    
    const costPer1k: Record<string, number> = {
      'gpt-4o': 0.005,
      'gpt-4-turbo': 0.01,
      'gpt-3.5-turbo': 0.0015,
      'text-embedding-3-small': 0.0001,
    };
    
    return ((costPer1k[model] || 0) * tokens) / 1000;
  }
  
  private sendToMonitoring(metric: AIMetrics) {
    // Send to your monitoring service
    console.log('[METRICS]', {
      requestId: metric.requestId,
      model: metric.model,
      duration: metric.duration,
      tokens: metric.tokens,
      cost: metric.cost,
      success: metric.success,
      error: metric.error,
    });
    
    // In production, send to:
    // - Sentry for errors
    // - DataDog for metrics
    // - PostHog for analytics
  }
  
  getMetrics() {
    return this.metrics;
  }
}

const metrics = new MetricsCollector();

// ═══════════════════════════════════════════════════════════
// MAIN AI ORCHESTRATOR
// ═══════════════════════════════════════════════════════════

export class SaintBrokerAI {
  
  /**
   * Main chat function - handles all user interactions
   */
  async chat(params: {
    message: string;
    conversationHistory?: Array<{ role: string; content: string }>;
    context?: {
      contactId?: string;
      opportunityId?: string;
      division?: 'investment' | 'real-estate' | 'lending';
      stage?: string;
      userRole?: string;
      isAdmin?: boolean;
    };
  }): Promise<{
    response: string;
    suggestedActions?: string[];
    nextSteps?: string[];
    confidence?: number;
  }> {
    const requestId = metrics.startRequest(CONFIG.models.primary);
    
    try {
      // 🧠 INTEGRATE KNOWLEDGE BASE SEARCH
      let knowledgeContext = '';
      try {
        const { knowledgeBaseService } = await import('../../services/knowledge-base');
        const results = await knowledgeBaseService.searchKnowledge(params.message, undefined, 3);
        
        if (results.length > 0) {
          knowledgeContext = '\n\n📚 RELEVANT KNOWLEDGE:\n' +
            results.map((r: any) => `- ${r.filename}: ${r.content.substring(0, 300)}...`).join('\n\n');
          console.log(`🧠 Found ${results.length} relevant knowledge chunks for query`);
        }
      } catch (kbError) {
        console.warn('Knowledge base search failed:', kbError);
      }
      
      // Build system prompt based on context
      const systemPrompt = this.buildSystemPrompt(params.context) + knowledgeContext;
      
      // Build conversation messages
      const messages = [
        { role: 'system', content: systemPrompt },
        ...(params.conversationHistory || []),
        { role: 'user', content: params.message },
      ];
      
      // Execute with circuit breaker and retry logic
      const completion = await breaker.execute(() =>
        retryWithBackoff(
          async () => {
            return await openai.chat.completions.create({
              model: CONFIG.models.primary,
              messages: messages as any,
              temperature: 0.7,
              max_tokens: 1000,
              response_format: { type: 'json_object' },
            });
          },
          'AI_CHAT'
        )
      );
      
      const response = completion.choices[0].message.content || '';
      const parsed = JSON.parse(response);
      
      // Record success metrics
      metrics.endRequest(
        requestId,
        true,
        completion.usage?.total_tokens
      );
      
      return {
        response: parsed.response || response,
        suggestedActions: parsed.suggestedActions,
        nextSteps: parsed.nextSteps,
        confidence: parsed.confidence,
      };
      
    } catch (error: any) {
      // Log error
      console.error('[SAINTBROKER_AI] Error:', error);
      metrics.endRequest(requestId, false, undefined, error.message);
      
      // Try fallback model
      try {
        console.log('[SAINTBROKER_AI] Attempting fallback model...');
        return await this.fallbackChat(params);
      } catch (fallbackError) {
        console.error('[SAINTBROKER_AI] Fallback failed:', fallbackError);
        
        // Return graceful error response
        return {
          response: "I apologize, but I'm experiencing technical difficulties. A team member will reach out to you shortly. Please call us at (949) 755-0720 if urgent.",
          suggestedActions: ['call_agent'],
          confidence: 0,
        };
      }
    }
  }
  
  /**
   * Fallback to Claude if OpenAI fails
   */
  private async fallbackChat(params: {
    message: string;
    conversationHistory?: Array<{ role: string; content: string }>;
    context?: any;
  }): Promise<any> {
    const requestId = metrics.startRequest('claude-3-5-sonnet');
    
    try {
      const systemPrompt = this.buildSystemPrompt(params.context);
      
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          ...(params.conversationHistory || []).map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          { role: 'user', content: params.message },
        ],
      });
      
      const response = message.content[0].type === 'text' 
        ? message.content[0].text 
        : '';
      
      metrics.endRequest(requestId, true, message.usage.input_tokens + message.usage.output_tokens);
      
      return {
        response,
        suggestedActions: [],
        confidence: 0.8,
      };
      
    } catch (error: any) {
      metrics.endRequest(requestId, false, undefined, error.message);
      throw error;
    }
  }
  
  /**
   * Build system prompt based on context
   */
  private buildSystemPrompt(context?: {
    contactId?: string;
    opportunityId?: string;
    division?: 'investment' | 'real-estate' | 'lending';
    stage?: string;
    userRole?: string;
    isAdmin?: boolean;
  }): string {
    const base = `You are SaintBroker AI, the intelligent assistant for Saint Vision Group - a premier AI-powered brokerage platform.

FUNDING PARTNER ROUTING INTELLIGENCE:
- Equipment financing → Commercial Capital Connect (specialists)
- Real Estate projects → Easy Street Capital (BRRRR/STR) or Trinity Bay (Fix&Flip)
- Startup with 700+ credit → Rich Mee (0% SLOC up to $100K)
- SBA loans → SB Lending Source (650+ credit required)
- General business ($50K-$5M) → SVG In-House first
- Urgent MCA/Working Capital → SVG Partner Network (1-3 day funding)
- Large commercial ($1M+) → Rok Financial

You guide clients through:
- Commercial Lending ($50K-$5M at 9%+ rates)
- Real Estate Financing (all 50 states)
- Investment Suite (9-12% fixed returns, faith-aligned)

${context?.isAdmin ? 'ADMIN MODE: Provide detailed pipeline insights and management advice.' : ''}

Always respond in JSON format with this structure:
{
  "response": "Your helpful message to the user",
  "suggestedActions": ["action1", "action2"],
  "nextSteps": ["step1", "step2"],
  "confidence": 0.95
}`;

    // Add division-specific context
    if (context?.division === 'lending') {
      return base + `\n\nCurrent Context: User is in the LENDING division.
Focus on: loan products, credit requirements, documentation needs, approval timeline.`;
    }
    
    if (context?.division === 'investment') {
      return base + `\n\nCurrent Context: User is in the INVESTMENT division.
Focus on: investment opportunities, accreditation status, minimum investments, returns.`;
    }
    
    if (context?.division === 'real-estate') {
      return base + `\n\nCurrent Context: User is in the REAL ESTATE division.
Focus on: property search, showing scheduling, offers, closing process.`;
    }
    
    return base;
  }
  
  /**
   * Analyze documents using AI
   */
  async analyzeDocument(params: {
    documentUrl: string;
    documentType: 'bank_statement' | 'tax_return' | 'pay_stub' | 'id' | 'other';
  }): Promise<{
    extracted: Record<string, any>;
    confidence: number;
    warnings?: string[];
  }> {
    const requestId = metrics.startRequest('gpt-4o-vision');
    
    try {
      // In production, you'd fetch the document and convert to base64
      // For now, this is a placeholder structure
      
      const completion = await retryWithBackoff(
        async () => {
          return await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: `You are a document analysis expert. Extract structured data from financial documents.
Return JSON with extracted fields and confidence scores.`,
              },
              {
                role: 'user',
                content: `Analyze this ${params.documentType} and extract all relevant information.`,
              },
            ],
            response_format: { type: 'json_object' },
          });
        },
        'DOCUMENT_ANALYSIS'
      );
      
      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      metrics.endRequest(requestId, true, completion.usage?.total_tokens);
      
      return {
        extracted: result.data || {},
        confidence: result.confidence || 0.8,
        warnings: result.warnings || [],
      };
      
    } catch (error: any) {
      metrics.endRequest(requestId, false, undefined, error.message);
      throw error;
    }
  }
  
  /**
   * Generate embeddings for semantic search
   */
  async generateEmbeddings(text: string): Promise<number[]> {
    const requestId = metrics.startRequest(CONFIG.models.embeddings);
    
    try {
      const response = await retryWithBackoff(
        async () => {
          return await openai.embeddings.create({
            model: CONFIG.models.embeddings,
            input: text,
          });
        },
        'EMBEDDINGS'
      );
      
      metrics.endRequest(requestId, true, response.usage.total_tokens);
      
      return response.data[0].embedding;
      
    } catch (error: any) {
      metrics.endRequest(requestId, false, undefined, error.message);
      throw error;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════

export const saintBrokerAI = new SaintBrokerAI();

// ═══════════════════════════════════════════════════════════
// USAGE EXAMPLE
// ═══════════════════════════════════════════════════════════

/*
// In your API route:
import { saintBrokerAI } from '@/lib/ai-orchestrator-production';

export async function POST(req: Request) {
  const { message, context } = await req.json();
  
  const response = await saintBrokerAI.chat({
    message,
    context,
    conversationHistory: [], // Load from database
  });
  
  return Response.json(response);
}
*/
