import OpenAI from "openai";

// Use Azure OpenAI as primary (fully configured), fallback to OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.AZURE_AI_FOUNDRY_KEY || process.env.OPENAI_API_KEY || "",
  baseURL: process.env.AZURE_AI_FOUNDRY_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT || undefined,
  defaultQuery: process.env.AZURE_AI_FOUNDRY_ENDPOINT ? { 'api-version': '2024-08-01-preview' } : undefined,
  defaultHeaders: process.env.AZURE_AI_FOUNDRY_ENDPOINT ? {
    'api-key': process.env.AZURE_AI_FOUNDRY_KEY || ""
  } : undefined
});

export interface ToneAnalysis {
  tone: string;
  confidence: number;
  escalationRequired: boolean;
}

export interface AssistantResponse {
  content: string;
  tone: ToneAnalysis;
  processingTime: number;
}

export async function analyzeTone(text: string): Promise<ToneAnalysis> {
  try {
    const startTime = Date.now();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a tone analysis expert. Analyze the sentiment and tone of the text. Determine if escalation to a human is required based on frustration, anger, or complex requests. Respond with JSON in this format: { 'tone': string, 'confidence': number, 'escalationRequired': boolean }"
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      tone: result.tone || "neutral",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      escalationRequired: Boolean(result.escalationRequired)
    };
  } catch (error) {
    console.error("Tone analysis failed:", error);
    return {
      tone: "unknown",
      confidence: 0,
      escalationRequired: false
    };
  }
}

export async function generateAssistantResponse(
  userMessage: string,
  context: string = "",
  knowledgeBase: string[] = []
): Promise<AssistantResponse> {
  const startTime = Date.now();
  
  try {
    // First analyze tone
    const toneAnalysis = await analyzeTone(userMessage);
    
    // Build context for the assistant
    const systemMessage = `You are SaintSal, an AI assistant with access to a comprehensive knowledge base. You help users with their questions using the provided context and knowledge.

Available Knowledge:
${knowledgeBase.join("\n\n")}

Context:
${context}

Respond helpfully and professionally. If the user seems frustrated or has a complex request, acknowledge their concern and provide the best assistance possible.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 1000
    });

    const processingTime = Date.now() - startTime;

    return {
      content: response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.",
      tone: toneAnalysis,
      processingTime
    };
  } catch (error) {
    console.error("Assistant response generation failed:", error);
    const processingTime = Date.now() - startTime;
    
    return {
      content: "I'm experiencing technical difficulties. Please try again or contact support if the issue persists.",
      tone: { tone: "error", confidence: 1, escalationRequired: true },
      processingTime
    };
  }
}

export async function processKnowledgeContent(content: string, filename: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Extract key information and create a structured summary of this document. Break it into digestible chunks that can be used for knowledge retrieval. Return as a JSON array of strings."
        },
        {
          role: "user",
          content: `Filename: ${filename}\n\nContent: ${content}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.chunks || [content];
  } catch (error) {
    console.error("Knowledge processing failed:", error);
    return [content];
  }
}
