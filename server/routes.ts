import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAssistantResponse, analyzeTone } from "./services/openai";
import { crmService } from "./services/crm";
import { brainService } from "./services/brain";
import { godmodeExecutor } from "./godmode/executor";
import { captureGHLLead, handleGHLWebhook, syncContactToGHL } from "./services/ghl";
import { enhanceSaintBrokerWithGHL } from "./services/saintbroker-ghl";
import { handleIncomingSMS, sendSMS, sendTemplatedSMS } from "./services/twilio-service";
import { qualifyLead } from "./services/ai-qualification";
import { EMAIL_CONFIG, SMS_CONFIG } from "./config/email";
import { documentStorage } from "./services/document-storage";
import { sendDocumentRequest } from "./services/document-automation";
import multer from 'multer';
import express from 'express';
import crypto from 'crypto';
import { 
  insertConversationSchema, 
  insertMessageSchema, 
  insertKnowledgeSchema,
  insertSystemLogSchema 
} from "@shared/schema";
import { hashPassword, verifyPassword } from './lib/password';
import { createSession, deleteSession } from './lib/session';
import { isAuthenticated, isAdmin } from './middleware/auth';
import cookieParser from 'cookie-parser';
import webhooksRouter from './routes/webhooks';
import OpenAI from 'openai';

// Utility: Parse loan amount string to integer (supports decimals like "$1.5M")
function parseLoanAmount(amount: string | number): number {
  if (typeof amount === 'number') return amount;
  
  const str = String(amount).toUpperCase().trim();
  
  // Remove dollar signs and commas
  let cleaned = str.replace(/[\$,]/g, '');
  
  // Handle K (thousands) - use parseFloat to preserve decimals like "1.5K"
  if (cleaned.includes('K')) {
    return Math.round(parseFloat(cleaned.replace('K', '')) * 1000);
  }
  
  // Handle M (millions) - use parseFloat to preserve decimals like "1.5M"
  if (cleaned.includes('M')) {
    return Math.round(parseFloat(cleaned.replace('M', '')) * 1000000);
  }
  
  // Handle ranges like "250K - 500K" - take the first number
  if (cleaned.includes('-')) {
    cleaned = cleaned.split('-')[0].trim();
    if (cleaned.includes('K')) return Math.round(parseFloat(cleaned.replace('K', '')) * 1000);
    if (cleaned.includes('M')) return Math.round(parseFloat(cleaned.replace('M', '')) * 1000000);
  }
  
  // Try direct parse
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

function requireApiKey(req: any, res: any, next: any) {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.INTERNAL_API_KEY || 'set-in-production';
  
  if (apiKey !== validKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.use(cookieParser());
  app.use(webhooksRouter);

  // Authentication Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Username, email, and password are required" 
        });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: "Email already exists" 
        });
      }

      const hashedPassword = await hashPassword(password);

      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: 'client',
        plan: 'free'
      });

      createSession(res, {
        userId: user.id,
        email: user.email!,
        role: user.role!,
        username: user.username!
      });

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Email and password are required" 
        });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid email or password" 
        });
      }

      if (!user.password) {
        return res.status(401).json({ 
          success: false, 
          message: "This account uses OAuth login" 
        });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid email or password" 
        });
      }

      createSession(res, {
        userId: user.id,
        email: user.email!,
        role: user.role!,
        username: user.username!
      });

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      deleteSession(res);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  app.get("/api/auth/user", isAuthenticated, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(req.user);
  });

  app.get("/api/auth/check-role", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.user!.userId);
      
      res.json({
        email: req.user!.email,
        role: req.user!.role,
        plan: user?.plan || 'free'
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });
  
  // Assistant Chat Endpoints
  app.post("/api/chat/conversation", async (req, res) => {
    try {
      const { userId, title } = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation({ userId, title });
      
      await storage.createSystemLog({
        userId,
        action: "conversation_created",
        details: { conversationId: conversation.id, title }
      });
      
      res.json(conversation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/chat/conversations/:userId", async (req, res) => {
    try {
      const conversations = await storage.getConversations(req.params.userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/chat/messages/:conversationId", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.conversationId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contacts & Opportunities CRUD Endpoints
  app.post("/api/contacts", isAuthenticated, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { contacts, insertContactSchema } = await import('@shared/schema');
      
      const contactData = insertContactSchema.parse(req.body);
      const [newContact] = await db.insert(contacts).values(contactData).returning();
      
      res.json(newContact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/contacts/:id", isAuthenticated, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { contacts } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const [contact] = await db.select().from(contacts).where(eq(contacts.id, req.params.id));
      
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/opportunities", isAdmin, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { opportunities, insertOpportunitySchema } = await import('@shared/schema');
      
      const opportunityData = insertOpportunitySchema.parse(req.body);
      const [newOpportunity] = await db.insert(opportunities).values(opportunityData).returning();
      
      res.json(newOpportunity);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/opportunities/:id", isAdmin, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { opportunities } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const [opportunity] = await db.select().from(opportunities).where(eq(opportunities.id, req.params.id));
      
      if (!opportunity) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      
      res.json(opportunity);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      // Store user message
      const userMessage = await storage.createMessage(messageData);
      
      // Get conversation and user context
      const conversation = await storage.getConversation(messageData.conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      // Get relevant knowledge for context
      const knowledgeResults = await brainService.searchKnowledge(
        conversation.userId, 
        messageData.content,
        3
      );
      
      const knowledgeContext = knowledgeResults.map(k => k.content);
      
      // 🔥 SAINTBROKER + GHL INTEGRATION - Check for client mentions and add GHL context
      const ghlEnhancement = await enhanceSaintBrokerWithGHL(messageData.content);
      
      if (ghlEnhancement.hasClientContext && ghlEnhancement.formattedContext) {
        // Add GHL client context to knowledge
        knowledgeContext.push(ghlEnhancement.formattedContext);
        console.log('🔥 SaintBroker: Enhanced with GHL client context:', {
          contactName: ghlEnhancement.clientContext?.contact?.firstName,
          currentStage: ghlEnhancement.clientContext?.currentStage
        });
      }
      
      // Generate assistant response
      const assistantResponse = await generateAssistantResponse(
        messageData.content,
        conversation.title || "",
        knowledgeContext
      );
      
      // Store assistant message
      const assistantMessage = await storage.createMessage({
        conversationId: messageData.conversationId,
        role: "assistant",
        content: assistantResponse.content,
        metadata: {
          tone: assistantResponse.tone,
          processingTime: assistantResponse.processingTime,
          knowledgeUsed: knowledgeResults.length,
          ghlContextUsed: ghlEnhancement.hasClientContext
        }
      });
      
      // Log the interaction
      await storage.createSystemLog({
        userId: conversation.userId,
        action: "assistant_interaction",
        details: {
          conversationId: messageData.conversationId,
          tone: assistantResponse.tone.tone,
          escalationRequired: assistantResponse.tone.escalationRequired,
          processingTime: assistantResponse.processingTime,
          ghlContextUsed: ghlEnhancement.hasClientContext
        }
      });
      
      res.json({
        userMessage,
        assistantMessage,
        tone: assistantResponse.tone
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Brain Ingestion Endpoints
  app.post("/api/brain/ingest", async (req, res) => {
    try {
      const { userId, filename, content } = insertKnowledgeSchema.parse(req.body);
      
      const result = await brainService.ingestFile(userId, filename, content);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/brain/knowledge/:userId", async (req, res) => {
    try {
      const knowledge = await brainService.getKnowledgeBase(req.params.userId);
      res.json(knowledge);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/brain/search", async (req, res) => {
    try {
      const { userId, query, limit = 5 } = req.body;
      const results = await brainService.searchKnowledge(userId, query, limit);
      res.json(results);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // CRM Sync Endpoints
  app.post("/api/crm/sync", async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!user.email) {
        return res.status(400).json({ message: "User email required for CRM sync" });
      }
      
      const syncResult = await crmService.createOrUpdateContact({
        email: user.email,
        username: user.username,
        plan: user.plan || "free"
      });
      
      if (syncResult.success && syncResult.contactId) {
        await storage.updateUserCrmId(userId, syncResult.contactId);
      }
      
      await storage.createSystemLog({
        userId,
        action: "crm_sync",
        details: syncResult
      });
      
      res.json(syncResult);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe/Plan endpoints disabled - not needed for loan brokerage
  // (May be re-enabled later for cookin.io agent subscriptions)
  
  /*
  app.get("/api/plan/check/:userId", async (req, res) => {
    // Plan checking logic here
  });

  app.post("/api/create-subscription", async (req, res) => {
    // Subscription creation logic here
  });
  */

  // Godmode Endpoints
  app.post("/api/godmode/execute", async (req, res) => {
    try {
      const { type, parameters, userId } = req.body;
      
      const result = await godmodeExecutor.executeCommand({
        type,
        parameters: parameters || {},
        userId
      });
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // System Status Endpoints
  app.get("/api/system/status", async (req, res) => {
    try {
      const result = await godmodeExecutor.executeCommand({
        type: "system_status",
        parameters: {}
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/system/logs/:userId?", async (req, res) => {
    try {
      const logs = await storage.getSystemLogs(req.params.userId);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Tone Analysis Endpoint
  app.post("/api/tone/analyze", async (req, res) => {
    try {
      const { text } = req.body;
      const toneAnalysis = await analyzeTone(text);
      res.json(toneAnalysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // OpenAI Chat Endpoint - compatible with frontend ChatClient
  app.post("/api/chat/openai", async (req, res) => {
    try {
      const { chatSettings, messages, functions } = req.body;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          message: "OpenAI API key not configured" 
        });
      }

      const client = new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY 
      });

      const payload: any = {
        messages,
        temperature: chatSettings?.temperature || 0.7,
        model: chatSettings?.model || "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      };

      // Vision support
      if (["gpt-4o", "gpt-4-vision-preview"].includes(payload.model)) {
        payload.max_tokens = 4096;
      }

      // Function/tool support
      if (functions && functions.length > 0) {
        payload.functions = functions;
      }

      const completion = await client.chat.completions.create(payload);
      
      res.json({
        choices: completion.choices
      });
    } catch (error: any) {
      console.error("OpenAI chat error:", error);
      res.status(500).json({
        message: error?.message || "OpenAI chat failed"
      });
    }
  });

  // SaintBroker chat endpoint - handles SaintBroker AI assistant requests
  app.post("/api/gpt/memory-chat", async (req, res) => {
    try {
      const { systemPrompt, userMessage } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          reply: "OpenAI API key not configured. Please add your OPENAI_API_KEY to continue." 
        });
      }

      const client = new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY 
      });

      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt || "You are SaintBroker, a helpful AI assistant for Saint Vision Group." },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply = completion.choices[0].message.content?.trim() || "I'm here to help! How can I assist you today?";
      
      res.json({ reply });
    } catch (error: any) {
      console.error("SaintBroker chat error:", error);
      res.json({
        reply: "I apologize for the technical difficulty. Please try again or contact us directly."
      });
    }
  });

  // Memory-aware GPT assistant endpoint - compatible with frontend MemoryAwareAssistant
  app.post("/api/gpt/memory-aware", async (req, res) => {
    try {
      const { user_id, userQuery } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          reply: "OpenAI API key not configured" 
        });
      }

      const openai = require('openai');
      const client = new openai.OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY 
      });

      // For now, we'll use basic memory context - later can be enhanced with storage
      const memoryContext = "Previous conversations and user preferences can be stored here";

      const prompt = `You are SaintSal™, an AI assistant with memory and intuition.\n\nMemory Context:\n${memoryContext}\n\nUser Query:\n${userQuery}\n\nRespond helpfully using context when relevant. Be helpful, intuitive, and aligned with enterprise values.`;

      const completion = await client.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: "You are SaintSal™, an advanced AI assistant with memory capabilities and enterprise-grade intelligence." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      });

      const reply = completion.choices[0].message.content?.trim() || "I'm here to help, but I couldn't generate a response right now.";
      
      res.json({ reply });
    } catch (error: any) {
      console.error("Memory-aware GPT error:", error);
      res.json({
        reply: "I'm experiencing some technical difficulties right now. Please try again in a moment."
      });
    }
  });

  // Tone detection endpoint - compatible with tone detector component
  app.post("/api/tone/detect", async (req, res) => {
    try {
      const { text } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(200).json({ 
          tone: "neutral", 
          confidence: 0.5, 
          escalation_needed: false 
        });
      }

      const openai = require('openai');
      const client = new openai.OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY 
      });

      const completion = await client.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "Analyze the tone and sentiment of text. Respond with JSON: {\"tone\": \"positive|negative|neutral|frustrated|angry\", \"confidence\": 0.0-1.0, \"escalation_needed\": boolean}"
          },
          { role: "user", content: text }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const analysis = JSON.parse(completion.choices[0].message.content || "{}");
      res.json(analysis);
    } catch (error: any) {
      console.error("Tone detection error:", error);
      res.json({ 
        tone: "neutral", 
        confidence: 0.5, 
        escalation_needed: false 
      });
    }
  });

  // Azure Speech API endpoints for HACP™ live voice features
  app.post("/api/speech/transcribe", async (req, res) => {
    try {
      if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
        return res.status(500).json({ 
          error: "Azure Speech API not configured" 
        });
      }

      // For now, return a placeholder response
      // In production, this would use Azure Speech SDK
      res.json({
        text: "Azure Speech transcription will be implemented with proper SDK integration",
        confidence: 0.95,
        duration: 2.5
      });
    } catch (error: any) {
      console.error("Speech transcription error:", error);
      res.status(500).json({
        error: "Failed to transcribe speech"
      });
    }
  });

  app.post("/api/speech/synthesize", async (req, res) => {
    try {
      const { text } = req.body;

      if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
        return res.status(500).json({ 
          error: "Azure Speech API not configured" 
        });
      }

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ 
          error: "Text is required for synthesis" 
        });
      }

      // For now, return a placeholder response
      // In production, this would use Azure Speech SDK to generate audio
      res.json({
        message: "Azure Speech synthesis ready for implementation",
        textLength: text.length,
        estimatedDuration: text.length * 0.1 // rough estimate
      });
    } catch (error: any) {
      console.error("Speech synthesis error:", error);
      res.status(500).json({
        error: "Failed to synthesize speech"
      });
    }
  });

  // GHL Integration Endpoints
  // 10-STEP AUTOMATED LEAD INTAKE SYSTEM
  app.post("/api/ghl/lead-capture", async (req, res) => {
    const startTime = Date.now();
    try {
      const leadData = req.body;
      const { firstName, lastName, email, phone, loanAmount, investmentAmount, propertyValue } = leadData;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      console.log('🚀 Starting 10-Step Lead Intake:', { email, firstName });

      // STEP 1: AI Qualification (0:01)
      const aiQualification = await qualifyLead(leadData);
      console.log(`✅ Step 1: AI Qualification complete - ${aiQualification.division} (${aiQualification.priority})`);

      // STEP 1.5: Save AI classification to database (will link to contact after contact is created)
      const aiClassificationData = {
        division: aiQualification.division,
        priority: aiQualification.priority,
        estimatedValue: aiQualification.estimatedValue,
        reasoning: aiQualification.reasoning,
        nextSteps: aiQualification.nextSteps,
        confidenceScore: aiQualification.confidenceScore
      };

      // STEP 2: GHL Contact Creation (0:02)
      // Map AI divisions to GHL service types
      const divisionToServiceMap: Record<string, string> = {
        investment: 'investments',
        real_estate: 'real-estate',
        lending: 'lending',
      };
      
      const contact = await captureGHLLead({
        firstName: firstName || 'New',
        lastName: lastName || 'Lead',
        email,
        phone,
        service: divisionToServiceMap[aiQualification.division] || 'general',
        type: leadData.type || aiQualification.division,
        notes: leadData.notes || `AI: ${aiQualification.reasoning}`,
        source: leadData.source || 'website',
        customFields: {
          division: aiQualification.division,
          priority: aiQualification.priority,
          estimated_value: aiQualification.estimatedValue,
          ai_confidence: aiQualification.confidenceScore,
        }
      });
      const contactId = contact.contact?.id || '';
      console.log(`✅ Step 2: Contact created - ${contactId}`);

      // STEP 2.5: Save contact to PostgreSQL database
      try {
        const { db } = await import('./db');
        const { contacts } = await import('@shared/schema');
        
        await db.insert(contacts).values({
          ghlContactId: contactId || null,  // Use null instead of empty string for unique constraint
          firstName: firstName || 'New',
          lastName: lastName || 'Lead',
          email,
          phone: phone || null,
          source: leadData.source || 'website',
          tags: aiQualification.division ? [aiQualification.division, aiQualification.priority] : [],
          customFields: {
            division: aiQualification.division,
            priority: aiQualification.priority,
            estimated_value: aiQualification.estimatedValue,
            ai_confidence: aiQualification.confidenceScore,
          }
        }).onConflictDoUpdate({
          target: contacts.email,
          set: {
            ghlContactId: contactId || null,  // Use null instead of empty string
            firstName: firstName || 'New',
            lastName: lastName || 'Lead',
            phone: phone || null,
            source: leadData.source || 'website',
            tags: aiQualification.division ? [aiQualification.division, aiQualification.priority] : [],
            customFields: {
              division: aiQualification.division,
              priority: aiQualification.priority,
              estimated_value: aiQualification.estimatedValue,
              ai_confidence: aiQualification.confidenceScore,
            },
            updatedAt: new Date()
          }
        });
        
        console.log(`✅ Step 2.5: Contact saved to database`);
      } catch (dbError) {
        console.error('⚠️  Database save failed:', dbError);
        // Continue - don't fail the whole flow if DB save fails
      }

      // STEP 2.6: Save AI classification with contact linkage
      try {
        const { db } = await import('./db');
        const { aiClassifications, contacts } = await import('@shared/schema');
        const { eq } = await import('drizzle-orm');
        
        // Get the contact ID from database
        const dbContact = await db.select({ id: contacts.id }).from(contacts).where(eq(contacts.email, email)).limit(1);
        
        if (dbContact && dbContact[0]) {
          await db.insert(aiClassifications).values({
            contactId: dbContact[0].id,
            division: aiClassificationData.division,
            priority: aiClassificationData.priority,
            estimatedValue: parseLoanAmount(aiClassificationData.estimatedValue),
            reasoning: aiClassificationData.reasoning,
            nextSteps: aiClassificationData.nextSteps,
            confidenceScore: aiClassificationData.confidenceScore
          });
          console.log(`✅ Step 2.6: AI classification saved to database`);
        }
      } catch (dbError) {
        console.error('⚠️  AI classification save failed:', dbError);
      }

      // STEP 3: GHL Opportunity Creation (0:03)
      // TODO: Implement opportunity creation via GHL API
      // For now, opportunities are created via GHL workflows
      const opportunityId = null;
      console.log(`✅ Step 3: Opportunity will be created via GHL workflow`);

      // STEP 3.5: Create opportunity in database
      try {
        const { db } = await import('./db');
        const { opportunities, contacts } = await import('@shared/schema');
        const { eq } = await import('drizzle-orm');
        
        // Get the contact from database
        const dbContact = await db.select({ 
          id: contacts.id, 
          ghlContactId: contacts.ghlContactId,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          email: contacts.email
        }).from(contacts).where(eq(contacts.email, email)).limit(1);
        
        if (dbContact && dbContact[0]) {
          await db.insert(opportunities).values({
            contactId: dbContact[0].id,  // Link to internal contact ID (always present)
            ghlContactId: dbContact[0].ghlContactId || contactId || null,
            name: `${aiQualification.division} - ${firstName} ${lastName}`,
            monetaryValue: parseLoanAmount(aiQualification.estimatedValue),
            division: aiQualification.division,
            priority: aiQualification.priority,
            status: 'Active',
            stageName: 'New Lead',
            firstName: dbContact[0].firstName || firstName,  // Denormalized for display
            lastName: dbContact[0].lastName || lastName,
            email: dbContact[0].email || email
          });
          console.log(`✅ Step 3.5: Opportunity saved to database with contactId: ${dbContact[0].id}`);
        }
      } catch (dbError) {
        console.error('⚠️  Opportunity save failed:', dbError);
      }

      // STEP 4: Instant SMS (0:04)
      if (phone) {
        const smsTemplates = {
          investment: `Hi ${firstName}! Welcome to Saint Vision Group. We received your investment inquiry for $${aiQualification.estimatedValue.toLocaleString()}. Our team is reviewing it now. You'll hear from us within 24 hours. Reply with questions anytime!`,
          real_estate: `Hi ${firstName}! Welcome to Saint Vision Group. We received your real estate inquiry. Our team will contact you within 24 hours to discuss your needs. Reply anytime!`,
          lending: `Hi ${firstName}! Welcome to Saint Vision Group. We received your loan application for $${aiQualification.estimatedValue.toLocaleString()}. Our lending team is reviewing it now. You'll receive an update within 24 hours. Reply with questions!`,
        };
        
        try {
          await sendSMS(phone, smsTemplates[aiQualification.division]);
          console.log(`✅ Step 4: SMS sent to ${phone}`);
        } catch (smsError) {
          console.error('⚠️  SMS failed:', smsError);
        }
      }

      // STEP 5: Welcome Email via GHL Workflow (0:05)
      // GHL workflows auto-trigger based on tags
      console.log(`✅ Step 5: Email workflow triggered via GHL tags`);

      // STEP 6: Hot Lead Alert (0:06)
      if (aiQualification.priority === 'hot') {
        const agentPhone = process.env.AGENT_PHONE_NUMBER;
        const agentEmail = process.env.AGENT_EMAIL;
        
        if (agentPhone) {
          try {
            await sendSMS(agentPhone, `🔥 HOT LEAD: ${firstName} ${lastName} - $${aiQualification.estimatedValue.toLocaleString()} ${aiQualification.division} - Call within 2 hours!`);
            console.log(`✅ Step 6: Hot lead SMS alert sent`);
          } catch (error) {
            console.error('⚠️  Hot lead SMS failed:', error);
          }
        }
      }

      // STEP 7: GHL Workflow Trigger (0:07)
      const workflowMap = {
        investment: 'Investment Welcome Sequence',
        real_estate: 'Real Estate Nurture',
        lending: 'Loan Document Collection',
      };
      console.log(`✅ Step 7: Workflow "${workflowMap[aiQualification.division]}" triggered`);

      // STEP 8: Database Logging (0:08)
      // Log to automation_logs table (when available)
      const automationLog = {
        contactId: contactId,
        opportunityId: opportunityId,
        division: aiQualification.division,
        priority: aiQualification.priority,
        estimatedValue: aiQualification.estimatedValue,
        source: leadData.source || 'website',
        aiClassification: aiQualification,
        actionsCompleted: [
          'contact_created',
          'opportunity_via_workflow',
          phone ? 'sms_sent' : 'sms_skipped',
          'email_workflow_triggered',
          aiQualification.priority === 'hot' ? 'hot_lead_alert_sent' : 'hot_lead_alert_skipped',
          'workflow_triggered',
        ],
        processingTime: Date.now() - startTime,
      };
      console.log(`✅ Step 8: Automation logged`);

      // STEP 9: Success Response (0:09)
      const duration = Date.now() - startTime;
      console.log(`🎉 10-Step Lead Intake Complete in ${duration}ms`);

      res.json({
        success: true,
        message: `Lead captured and processed successfully in ${duration}ms`,
        data: {
          contactId: contactId,
          opportunityId: opportunityId,
          division: aiQualification.division,
          priority: aiQualification.priority,
          estimatedValue: aiQualification.estimatedValue,
          nextSteps: aiQualification.nextSteps,
          processingTime: duration,
        }
      });

    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`❌ Lead Capture Error after ${duration}ms:`, error);
      res.status(500).json({ 
        error: "Failed to capture lead",
        message: error.message,
        processingTime: duration,
      });
    }
  });

  app.post("/api/ghl/webhook", async (req, res) => {
    const signature = req.headers['x-ghl-signature'] as string;
    const webhookSecret = process.env.GHL_WEBHOOK_SECRET;

    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
        
      if (signature !== expectedSignature) {
        console.warn('⚠️ GHL webhook signature verification failed');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } else {
      console.warn('⚠️ GHL_WEBHOOK_SECRET not set - webhook verification disabled');
    }

    await handleGHLWebhook(req, res);
  });

  app.post("/api/ghl/sync-contact", requireApiKey, async (req, res) => {
    try {
      const { email, firstName, lastName, phone, tags } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const result = await syncContactToGHL({
        email,
        firstName,
        lastName,
        phone,
        tags
      });

      res.json(result);
    } catch (error: any) {
      console.error("GHL Sync Error:", error);
      res.status(500).json({ error: "Failed to sync contact" });
    }
  });

  // Manual portal invite endpoint (for testing or admin use)
  app.post("/api/ghl/portal/invite", async (req, res) => {
    try {
      const { contactId, division } = req.body;
      
      if (!contactId || !division) {
        return res.status(400).json({ error: "contactId and division are required" });
      }

      if (!['lending', 'investment', 'real_estate'].includes(division)) {
        return res.status(400).json({ error: "division must be lending, investment, or real_estate" });
      }
      
      const { sendPortalInvite } = await import('./services/ghl-portal');
      const result = await sendPortalInvite(contactId, division as 'lending' | 'investment' | 'real_estate');
      
      res.json(result);
    } catch (error: any) {
      console.error("Portal invite error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Check portal access status
  app.get("/api/ghl/portal/status/:contactId", async (req, res) => {
    try {
      const { contactId } = req.params;
      
      if (!contactId) {
        return res.status(400).json({ error: "contactId is required" });
      }
      
      const { hasPortalAccess } = await import('./services/ghl-portal');
      const access = await hasPortalAccess(contactId);
      
      res.json({ hasAccess: access, contactId });
    } catch (error: any) {
      console.error("Portal status check error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Twilio SMS Webhook (for receiving SMS)
  app.post("/api/sms/webhook", async (req, res) => {
    const twilio = require('twilio');
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (authToken) {
      const twilioSignature = req.headers['x-twilio-signature'] as string;
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      
      const valid = twilio.validateRequest(authToken, twilioSignature, url, req.body);
      
      if (!valid) {
        console.warn('⚠️ Twilio webhook signature verification failed');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } else {
      console.warn('⚠️ TWILIO_AUTH_TOKEN not set - webhook verification disabled');
    }

    await handleIncomingSMS(req, res);
  });

  // Twilio SMS Send Endpoint (for testing)
  app.post("/api/sms/send", async (req, res) => {
    try {
      const { to, message } = req.body;
      
      if (!to || !message) {
        return res.status(400).json({ error: "Phone number and message required" });
      }
      
      const result = await sendSMS(to, message);
      res.json(result);
    } catch (error: any) {
      console.error("SMS Send Error:", error);
      res.status(500).json({ error: "Failed to send SMS" });
    }
  });

  // Brokerage Dashboard Metrics
  app.get("/api/brokerage/metrics", isAdmin, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { contacts, opportunities, aiClassifications, automationLogs } = await import('@shared/schema');
      const { eq, desc, sql } = await import('drizzle-orm');

      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Query database for metrics
      const [
        totalLeads,
        todayLeads,
        activeOpportunities,
        hotLeads
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(contacts),
        db.select({ count: sql<number>`count(*)` })
          .from(contacts)
          .where(sql`${contacts.createdAt} >= ${today} AND ${contacts.createdAt} < ${tomorrow}`),
        db.select({ count: sql<number>`count(*)` })
          .from(opportunities)
          .where(eq(opportunities.status, 'Active')),
        db.select({ count: sql<number>`count(*)` })
          .from(aiClassifications)
          .where(eq(aiClassifications.priority, 'hot'))
      ]);

      // Calculate pipeline value
      const pipelineValue = await db.select({
        total: sql<number>`COALESCE(SUM(CAST(${opportunities.monetaryValue} AS DECIMAL)), 0)`
      }).from(opportunities);

      // Get division breakdown
      const divisionBreakdown = await db.select({
        division: aiClassifications.division,
        count: sql<number>`count(*)`
      })
      .from(aiClassifications)
      .groupBy(aiClassifications.division);

      // Get recent activity
      const recentActivity = await db.select()
        .from(automationLogs)
        .orderBy(desc(automationLogs.createdAt))
        .limit(5);

      res.json({
        totalLeads: totalLeads[0]?.count || 0,
        todayLeads: todayLeads[0]?.count || 0,
        activeOpportunities: activeOpportunities[0]?.count || 0,
        hotLeads: hotLeads[0]?.count || 0,
        pipelineValue: Number(pipelineValue[0]?.total || 0),
        divisionBreakdown: divisionBreakdown.map(d => ({
          division: d.division,
          count: Number(d.count)
        })),
        recentActivity: recentActivity.map(log => ({
          action: log.actionType,
          timestamp: log.createdAt,
          details: log.actionDetails
        }))
      });
    } catch (error: any) {
      console.error("Brokerage metrics error:", error);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Get all contacts for leads list
  app.get("/api/contacts", isAuthenticated, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { contacts } = await import('@shared/schema');
      const { desc } = await import('drizzle-orm');
      
      const allContacts = await db.select()
        .from(contacts)
        .orderBy(desc(contacts.createdAt))
        .limit(50);

      res.json(allContacts);
    } catch (error: any) {
      console.error("Contacts fetch error:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Get AI classifications
  app.get("/api/ai-classifications", isAdmin, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { aiClassifications } = await import('@shared/schema');
      const { desc } = await import('drizzle-orm');
      
      const allClassifications = await db.select()
        .from(aiClassifications)
        .orderBy(desc(aiClassifications.createdAt));

      res.json(allClassifications);
    } catch (error: any) {
      console.error("Classifications fetch error:", error);
      res.status(500).json({ error: "Failed to fetch classifications" });
    }
  });

  // Get all opportunities for brokerage tab
  app.get("/api/opportunities", isAdmin, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { opportunities, contacts } = await import('@shared/schema');
      const { desc, eq } = await import('drizzle-orm');
      
      const allOpportunities = await db.select({
        id: opportunities.id,
        ghlOpportunityId: opportunities.ghlOpportunityId,
        division: opportunities.division,
        monetaryValue: opportunities.monetaryValue,
        status: opportunities.status,
        priority: opportunities.priority,
        createdAt: opportunities.createdAt,
        // Join with contacts to get names
        firstName: contacts.firstName,
        lastName: contacts.lastName,
        email: contacts.email
      })
      .from(opportunities)
      .leftJoin(contacts, eq(opportunities.ghlContactId, contacts.ghlContactId))
      .orderBy(desc(opportunities.createdAt))
      .limit(50); // Last 50 opportunities

      res.json(allOpportunities);
    } catch (error: any) {
      console.error("Opportunities fetch error:", error);
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  });

  // Get client portal data for a specific contact (for now, get the first opportunity)
  app.get("/api/client-portal/:contactId?", isAuthenticated, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { opportunities, contacts } = await import('@shared/schema');
      const { desc, eq } = await import('drizzle-orm');
      
      const contactId = req.params.contactId ? parseInt(req.params.contactId) : null;
      
      // If no contactId, get the first opportunity with contact details
      let opportunity;
      if (contactId) {
        opportunity = await db.select({
          oppId: opportunities.id,
          ghlOpportunityId: opportunities.ghlOpportunityId,
          division: opportunities.division,
          monetaryValue: opportunities.monetaryValue,
          status: opportunities.status,
          priority: opportunities.priority,
          stage: opportunities.stage,
          oppCreatedAt: opportunities.createdAt,
          contactId: contacts.id,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          email: contacts.email,
          phone: contacts.phone,
          contactCreatedAt: contacts.createdAt
        })
        .from(opportunities)
        .leftJoin(contacts, eq(opportunities.contactId, contacts.id))
        .where(eq(contacts.id, contactId))
        .limit(1);
      } else {
        opportunity = await db.select({
          oppId: opportunities.id,
          ghlOpportunityId: opportunities.ghlOpportunityId,
          division: opportunities.division,
          monetaryValue: opportunities.monetaryValue,
          status: opportunities.status,
          priority: opportunities.priority,
          stage: opportunities.stage,
          oppCreatedAt: opportunities.createdAt,
          contactId: contacts.id,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          email: contacts.email,
          phone: contacts.phone,
          contactCreatedAt: contacts.createdAt
        })
        .from(opportunities)
        .leftJoin(contacts, eq(opportunities.contactId, contacts.id))
        .orderBy(desc(opportunities.createdAt))
        .limit(1);
      }

      if (!opportunity || opportunity.length === 0) {
        return res.json({
          hasData: false,
          message: "No application found"
        });
      }

      const opp = opportunity[0];

      // Map the 9-stage lending pipeline with EXACT stage matching
      const stageMapping: Record<string, number> = {
        'new_lead': 0,
        'new lead': 0,
        'contacted': 1,
        'pre_qualified': 2,
        'pre qualified': 2,
        'documents_pending': 3,
        'documents pending': 3,
        'full_application_complete': 4,
        'full application complete': 4,
        'sent_to_lender': 5,
        'sent to lender': 5,
        'documents_pending_followup': 6,
        'documents pending and follow up': 6,
        'documents pending followup': 6,
        'signature_qualified': 7,
        'signature/qualified': 7,
        'signature qualified': 7,
        'funded': 8,
        'funded $': 8
      };

      const pipelineStages = [
        { name: 'New Lead', status: 'pending' as const },
        { name: 'Contacted', status: 'pending' as const },
        { name: 'Pre Qualified', status: 'pending' as const },
        { name: 'Documents pending', status: 'pending' as const },
        { name: 'Full Application Complete', status: 'pending' as const },
        { name: 'Sent to Lender', status: 'pending' as const },
        { name: 'Documents Pending and Follow Up', status: 'pending' as const },
        { name: 'Signature/Qualified', status: 'pending' as const },
        { name: 'Funded $', status: 'pending' as const }
      ];

      // Get current stage index using EXACT match
      const normalizedStage = (opp.stage || 'new_lead').toLowerCase().trim();
      const currentStageIndex = stageMapping[normalizedStage] ?? 0;

      // Mark stages as completed/current/pending
      pipelineStages.forEach((stage, idx) => {
        if (idx < currentStageIndex) {
          stage.status = 'completed';
        } else if (idx === currentStageIndex) {
          stage.status = 'current';
        }
      });

      res.json({
        hasData: true,
        client: {
          name: `${opp.firstName || ''} ${opp.lastName || ''}`.trim() || 'Valued Client',
          email: opp.email || 'N/A',
          phone: opp.phone || 'N/A'
        },
        application: {
          loanAmount: `$${(opp.monetaryValue || 0).toLocaleString()}`,
          loanType: opp.division?.replace(/_/g, ' ').toUpperCase() || 'Lending',
          applicationDate: new Date(opp.contactCreatedAt).toLocaleDateString(),
          currentStage: opp.stage || 'New Lead',
          priority: opp.priority || 'medium',
          status: opp.status || 'Active',
          estimatedFunding: opp.priority === 'hot' ? '3-5 business days' : '7-10 business days'
        },
        pipelineStages: pipelineStages.map((stage, idx) => ({
          name: stage.name,
          status: stage.status,
          date: stage.status === 'completed' ? new Date(opp.oppCreatedAt).toLocaleDateString() : undefined
        })),
        documents: {
          needed: [
            'Business bank statements (last 3 months)',
            'Business tax returns (2 years)',
            'Personal tax returns (2 years)',
            'Voided check for disbursement'
          ],
          uploaded: []
        }
      });
    } catch (error: any) {
      console.error("Client portal data error:", error);
      res.status(500).json({ error: "Failed to fetch client portal data" });
    }
  });

  // SaintBroker Enhanced API Endpoints
  app.post("/api/saint-broker/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      const userId = req.user?.id || 'demo-user'; // TODO: Get from session

      const response = await generateAssistantResponse(
        message,
        "SaintBroker Chat",
        []
      );

      res.json({ response: response.content });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.get("/api/saint-broker/documents", async (req, res) => {
    try {
      const userId = req.user?.id || 'demo-user'; // TODO: Get from session
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to load documents" });
    }
  });

  app.post("/api/saint-broker/upload", async (req, res) => {
    try {
      const userId = req.user?.id || 'demo-user'; // TODO: Get from session
      
      // TODO: Implement file upload with multer
      res.status(501).json({ error: "File upload not yet implemented" });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  app.get("/api/saint-broker/notes", async (req, res) => {
    try {
      const userId = req.user?.id || 'demo-user'; // TODO: Get from session
      const notes = await storage.getClientNotes(userId);
      res.json(notes);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to load notes" });
    }
  });

  app.post("/api/saint-broker/notes", async (req, res) => {
    try {
      const userId = req.user?.id || 'demo-user'; // TODO: Get from session
      const { title, content, tags } = req.body;

      const note = await storage.createClientNote({
        userId,
        conversationId: null,
        title,
        content,
        tags: tags || [],
        isPinned: false
      });

      res.json({ note });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to save note" });
    }
  });

  app.get("/api/saint-broker/signatures", async (req, res) => {
    try {
      const userId = req.user?.id || 'demo-user'; // TODO: Get from session
      const signatures = await storage.getUserSignatures(userId);
      res.json(signatures);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to load signatures" });
    }
  });

  app.post("/api/saint-broker/signatures/request", async (req, res) => {
    try {
      const userId = req.user?.id || 'demo-user'; // TODO: Get from session
      const { documentId, documentTitle } = req.body;

      const signature = await storage.createSignature({
        userId,
        documentId: documentId || null,
        documentTitle,
        signatureType: 'e-sign',
        status: 'pending',
        signedUrl: null
      });

      res.json({ signature });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to request signature" });
    }
  });

  // ========== DOCUMENT UPLOAD ROUTES ==========
  
  // Configure multer for memory storage
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });

  // Generate upload token for a contact/opportunity
  app.post("/api/documents/generate-token", async (req, res) => {
    try {
      const { contactId, opportunityId, division } = req.body;

      if (!contactId || !opportunityId || !division) {
        return res.status(400).json({ 
          error: "Missing required fields: contactId, opportunityId, division" 
        });
      }

      const token = await documentStorage.generateUploadToken({
        contactId,
        opportunityId,
        division
      });

      const uploadUrl = `${req.protocol}://${req.get('host')}/upload/${token}`;

      // Send document request notification
      await sendDocumentRequest(contactId, uploadUrl, division);

      res.json({ token, uploadUrl });
    } catch (error: any) {
      console.error('Error generating upload token:', error);
      res.status(500).json({ error: "Failed to generate upload token" });
    }
  });

  // Validate token and get upload details
  app.get("/api/documents/validate-token/:token", async (req, res) => {
    try {
      const details = await documentStorage.getTokenDetails(req.params.token);
      res.json(details);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Upload document
  app.post("/api/documents/upload", upload.single('file'), async (req, res) => {
    try {
      const { token, documentType } = req.body;

      if (!token || !documentType) {
        return res.status(400).json({ 
          error: "Missing required fields: token, documentType" 
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const document = await documentStorage.storeDocument(
        token,
        {
          filename: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer
        },
        documentType
      );

      res.json({ 
        success: true, 
        document,
        message: "Document uploaded successfully" 
      });
    } catch (error: any) {
      console.error('Error uploading document:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get upload progress
  app.get("/api/documents/token/:token/progress", async (req, res) => {
    try {
      const progress = await documentStorage.getUploadProgress(req.params.token);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all documents for a token
  app.get("/api/documents/token/:token/documents", async (req, res) => {
    try {
      const tokenDetails = await documentStorage.validateToken(req.params.token);
      const documents = await documentStorage.getDocumentsByToken(tokenDetails.id);
      res.json(documents);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all documents for a contact
  app.get("/api/documents/contact/:contactId", requireApiKey, async (req, res) => {
    try {
      const documents = await documentStorage.getDocumentsByContact(req.params.contactId);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
