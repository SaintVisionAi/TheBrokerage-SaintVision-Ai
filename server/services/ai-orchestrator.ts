import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// AI Model Providers Configuration - CLAUDE IS PRIMARY!
export enum AIProvider {
  CLAUDE = 'claude-3-5-sonnet',      // ⭐ MAIN MAN - Claude 3.5 Sonnet (PRIMARY)
  CLAUDE_HAIKU = 'claude-3-haiku',   // Claude Haiku for fast responses
  GPT5_FAST = 'gpt-5-fast',          // Azure AI Foundry GPT-5
  GROK3 = 'grok-3-biz',              // Azure AI Gateway Grok
  GEMINI = 'gemini-pro',            // Google Gemini
  GPT4O = 'gpt-4o',                 // OpenAI GPT-4 (Fallback)
  GPT4_MINI = 'gpt-4o-mini'         // OpenAI Mini (Fast/Cheap)
}

// Initialize all AI clients
class AIOrchestrator {
  private claudeClient: Anthropic | null = null;
  private azureGPT5Client: OpenAI | null = null;
  private grokClient: OpenAI | null = null;
  private geminiClient: GoogleGenerativeAI | null = null;
  private openaiClient: OpenAI | null = null;
  
  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    // ⭐ CLAUDE - THE MAIN MAN - PRIMARY AI BRAIN
    if (process.env.ANTHROPIC_API_KEY) {
      console.log('⭐ Initializing Claude 3.5 Sonnet - PRIMARY AI BRAIN with MAX TOKENS...');
      this.claudeClient = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        maxRetries: 3,
        // Support for up to 1M tokens!
      });
      console.log('✅ Claude configured with 200K context window + extended output support!');
    }

    // Azure GPT-5 FAST
    if (process.env.AZURE_AI_FOUNDRY_KEY && process.env.AZURE_AI_FOUNDRY_ENDPOINT) {
      console.log('🔵 Initializing Azure GPT-5 FAST...');
      const endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT.replace(/\/$/, '');
      this.azureGPT5Client = new OpenAI({
        apiKey: process.env.AZURE_AI_FOUNDRY_KEY,
        baseURL: `${endpoint}/openai/deployments/gpt-5-fast`,
        defaultQuery: { 'api-version': '2025-04-01-preview' },
        defaultHeaders: { 'api-key': process.env.AZURE_AI_FOUNDRY_KEY }
      });
    }

    // Grok-3 via Azure AI Gateway
    if (process.env.AZURE_AI_FOUNDRY_KEY) {
      console.log('🟠 Initializing Grok-3 Business Intelligence...');
      this.grokClient = new OpenAI({
        apiKey: process.env.AZURE_AI_FOUNDRY_KEY,
        baseURL: 'https://sv-cookin-foundry.services.ai.azure.com/models',
        defaultQuery: { 'api-version': '2024-05-01-preview' },
        defaultHeaders: { 'api-key': process.env.AZURE_AI_FOUNDRY_KEY }
      });
    }

    // Google Gemini
    if (process.env.GEMINI_API_KEY) {
      console.log('🔷 Initializing Google Gemini Pro...');
      this.geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    // OpenAI Fallback
    if (process.env.OPENAI_API_KEY) {
      console.log('🟢 Initializing OpenAI GPT-4o (Fallback)...');
      this.openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }

    console.log('✅ AI Orchestrator initialized with multiple providers');
  }

  // Intelligent model selection - CLAUDE IS PRIMARY!
  async selectModel(taskType: string): Promise<AIProvider> {
    // Claude is ALWAYS first choice unless specific need
    switch(taskType) {
      case 'fast':
      case 'realtime':
        return AIProvider.GPT5_FAST; // GPT-5 only for speed critical
      
      case 'vision':
      case 'multimodal':
        return AIProvider.GEMINI; // Gemini for visual tasks
      
      case 'creative':
      case 'analysis':
      case 'business':
      case 'finance':
      case 'general':
      default:
        return AIProvider.CLAUDE; // ⭐ CLAUDE IS DEFAULT FOR EVERYTHING!
    }
  }

  // Generate response with automatic fallback
  async generateResponse(
    prompt: string,
    systemPrompt: string = '',
    provider: AIProvider = AIProvider.CLAUDE,
    options: any = {}
  ): Promise<{ content: string; provider: string; processingTime: number }> {
    const startTime = Date.now();
    
    try {
      let content = '';
      let usedProvider = provider;

      // Try primary provider first
      try {
        content = await this.callProvider(provider, prompt, systemPrompt, options);
      } catch (error) {
        console.warn(`Primary provider ${provider} failed, trying fallbacks...`);
        
        // Fallback chain: Claude -> GPT-5 -> GPT-4o -> Gemini
        const fallbackChain = [
          AIProvider.CLAUDE,
          AIProvider.GPT5_FAST,
          AIProvider.GPT4O,
          AIProvider.GEMINI
        ].filter(p => p !== provider);

        for (const fallback of fallbackChain) {
          try {
            content = await this.callProvider(fallback, prompt, systemPrompt, options);
            usedProvider = fallback;
            console.log(`✅ Fallback to ${fallback} successful`);
            break;
          } catch (fallbackError) {
            console.warn(`Fallback ${fallback} also failed`);
          }
        }

        if (!content) {
          throw new Error('All AI providers failed');
        }
      }

      return {
        content,
        provider: usedProvider,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('AI Orchestrator error:', error);
      throw error;
    }
  }

  // Call specific provider
  private async callProvider(
    provider: AIProvider,
    prompt: string,
    systemPrompt: string,
    options: any
  ): Promise<string> {
    switch(provider) {
      case AIProvider.CLAUDE:
        if (!this.claudeClient) throw new Error('Claude not configured');
        const claudeResponse = await this.claudeClient.messages.create({
          model: 'claude-3-5-sonnet-20241022', // Latest Claude 3.5 Sonnet
          max_tokens: options.maxTokens || 8192, // Increased default for better responses
          temperature: options.temperature || 0.7,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }],
          // Claude supports up to 200K context window!
        });
        return claudeResponse.content[0].type === 'text' 
          ? claudeResponse.content[0].text 
          : '';

      case AIProvider.GPT5_FAST:
        if (!this.azureGPT5Client) throw new Error('GPT-5 not configured');
        const gpt5Response = await this.azureGPT5Client.chat.completions.create({
          model: 'gpt-5-fast',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature || 0.7
        });
        return gpt5Response.choices[0].message.content || '';

      case AIProvider.GROK3:
        if (!this.grokClient) throw new Error('Grok not configured');
        const grokResponse = await this.grokClient.chat.completions.create({
          model: 'grok-3-biz',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature || 0.7
        });
        return grokResponse.choices[0].message.content || '';

      case AIProvider.GEMINI:
        if (!this.geminiClient) throw new Error('Gemini not configured');
        const model = this.geminiClient.getGenerativeModel({ model: 'gemini-pro' });
        const geminiResponse = await model.generateContent(`${systemPrompt}\n\n${prompt}`);
        return geminiResponse.response.text();

      case AIProvider.GPT4O:
      case AIProvider.GPT4_MINI:
        if (!this.openaiClient) throw new Error('OpenAI not configured');
        const openaiResponse = await this.openaiClient.chat.completions.create({
          model: provider === AIProvider.GPT4_MINI ? 'gpt-4o-mini' : 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature || 0.7
        });
        return openaiResponse.choices[0].message.content || '';

      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  // Get embeddings for knowledge base
  async getEmbeddings(text: string): Promise<number[]> {
    try {
      // Use Azure embeddings endpoint
      if (this.azureGPT5Client) {
        const response = await fetch(
          'https://sv-cookin-foundry.cognitiveservices.azure.com/openai/deployments/embed-3-large/embeddings?api-version=2023-05-15',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': process.env.AZURE_AI_FOUNDRY_KEY!
            },
            body: JSON.stringify({
              input: text,
              model: 'text-embedding-3-large'
            })
          }
        );
        const data = await response.json();
        return data.data[0].embedding;
      }

      // Fallback to OpenAI embeddings
      if (this.openaiClient) {
        const response = await this.openaiClient.embeddings.create({
          model: 'text-embedding-3-large',
          input: text
        });
        return response.data[0].embedding;
      }

      throw new Error('No embedding provider available');
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw error;
    }
  }

  // Health check for all providers
  async healthCheck(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {};

    // Check each provider
    if (this.claudeClient) {
      try {
        await this.callProvider(AIProvider.CLAUDE, 'test', 'test', { maxTokens: 10 });
        status.claude = true;
      } catch { status.claude = false; }
    }

    if (this.azureGPT5Client) {
      try {
        await this.callProvider(AIProvider.GPT5_FAST, 'test', 'test', { maxTokens: 10 });
        status.gpt5 = true;
      } catch { status.gpt5 = false; }
    }

    if (this.grokClient) {
      try {
        await this.callProvider(AIProvider.GROK3, 'test', 'test', { maxTokens: 10 });
        status.grok = true;
      } catch { status.grok = false; }
    }

    if (this.geminiClient) {
      try {
        await this.callProvider(AIProvider.GEMINI, 'test', 'test', { maxTokens: 10 });
        status.gemini = true;
      } catch { status.gemini = false; }
    }

    if (this.openaiClient) {
      try {
        await this.callProvider(AIProvider.GPT4O, 'test', 'test', { maxTokens: 10 });
        status.openai = true;
      } catch { status.openai = false; }
    }

    return status;
  }
}

// Export singleton instance
export const aiOrchestrator = new AIOrchestrator();

// Export for backward compatibility
export async function generateAssistantResponse(
  userMessage: string,
  context: string = '',
  knowledgeBase: string[] = []
): Promise<any> {
  const systemPrompt = `You are SaintBroker AI™, powered by multiple AI models including Claude 3.5 Sonnet, GPT-5 FAST, and more. 
You help users with business lending, real estate, and investments.

Available Knowledge:
${knowledgeBase.join('\n\n')}

Context:
${context}`;

  // Select best model for the task
  const taskType = userMessage.toLowerCase().includes('loan') || userMessage.toLowerCase().includes('lending')
    ? 'business'
    : 'analysis';
  
  const selectedProvider = await aiOrchestrator.selectModel(taskType);
  
  return await aiOrchestrator.generateResponse(
    userMessage,
    systemPrompt,
    selectedProvider
  );
}