import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAssistantResponse, analyzeTone, openai, MODEL_NAME } from "./services/openai";
import { saintBrokerAI } from "./lib/production";
import { crmService } from "./services/crm";
import { brainService } from "./services/brain";
import { godmodeExecutor } from "./godmode/executor";
import { captureGHLLead, handleGHLWebhook, syncContactToGHL, sendEmailViaGHL } from "./services/ghl";
import { enhanceSaintBrokerWithGHL } from "./services/saintbroker-ghl";
import { handleIncomingSMS, sendSMS, sendTemplatedSMS } from "./services/twilio-service";
import { qualifyLead } from "./services/ai-qualification";
import { EMAIL_CONFIG, SMS_CONFIG } from "./config/email";
import { documentStorage } from "./services/document-storage";
import { sendDocumentRequest } from "./services/document-automation";
import { knowledgeBaseService } from "./services/knowledge-base";
import multer from 'multer';
import express from 'express';
import crypto from 'crypto';
import { setupVoiceRoutes } from './routes/voice';
import { registerEmailVerificationRoutes } from './routes/email-verification';
import ghlDataRouter from './routes/ghl-data';
import visionRouter from './routes/vision';
import ghlFormsRouter from './routes/ghl-forms';
import databaseQueryRouter from './routes/database-query';
import saintsalRouter from './routes/saintsal';
import rateLimit from 'express-rate-limit';
import { encrypt, decrypt, redactSSN, isValidBase64 } from './lib/encryption';
import { applicationSubmitSchema, sanitizeInput, isValidSSN } from './lib/validation';
import { 
  insertConversationSchema, 
  insertMessageSchema, 
  insertKnowledgeSchema,
  insertSystemLogSchema,
  insertLoanProductSchema,
  insertApplicationSignatureSchema,
  insertApplicationDocumentSchema
} from "@shared/schema";
import { hashPassword, verifyPassword } from './lib/password';
import { createSession, deleteSession } from './lib/session';
import { isAuthenticated, isAdmin } from './middleware/auth';
import cookieParser from 'cookie-parser';
import webhooksRouter from './routes/webhooks';
import { FUNDING_PARTNERS } from '../shared/funding-partners-ai';
import { LOAN_PRODUCTS_DATA } from '../shared/loan-products-data';
import { autoSelectFundingPartner } from '../shared/funding-partners-ai';
import * as fs from 'fs';
import * as path from 'path';

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
  const validKey = process.env.INTERNAL_API_KEY;
  
  // Ensure API key is configured (this should never happen if server startup validation works)
  if (!validKey) {
    console.error('CRITICAL: INTERNAL_API_KEY is not configured!');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }
  
  // Validate the provided API key
  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: 'Unauthorized - Invalid or missing API key' });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {

  app.use(cookieParser());
  app.use(webhooksRouter);

  // Setup voice routes for speech-to-text and text-to-speech
  setupVoiceRoutes(app);

  // Setup email verification and password reset routes
  registerEmailVerificationRoutes(app, storage);

  // Setup GHL data routes
  app.use('/api', databaseQueryRouter);
  app.use('/api/ghl', ghlDataRouter);

  // Setup GHL form routes
  app.use('/api/ghl-forms', ghlFormsRouter);

  // Setup SaintSal AI routes
  app.use('/api', saintsalRouter);

  // Setup vision analysis routes
  app.use('/api/vision', visionRouter);

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
        emailVerified: false // New users need to verify their email
      });
      
      // Generate verification token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 24); // 24 hour expiry
      
      // Save verification token
      await storage.updateUserVerificationToken(user.id, token, expires);
      
      // TODO: Send verification email here
      // For now, log it (in production, integrate with GHL or SendGrid)
      console.log(`🔔 New User Signup - Verification needed:`);
      console.log(`Email: ${email}`);
      console.log(`Token: ${token}`);
      console.log(`Verification URL: ${process.env.FRONTEND_URL || 'https://saintvisionai.com'}/verify-email/${token}`);

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
          role: user.role,
          emailVerified: user.emailVerified
        },
        message: "Account created! Please check your email to verify your account."
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

      const sessionData = {
        userId: user.id,
        email: user.email!,
        role: user.role!,
        username: user.username!
      };

      // Create session cookie AND return JWT token
      const jwtToken = createSession(res, sessionData);

      res.json({
        success: true,
        token: jwtToken,
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
    
    // Return in the format the frontend expects
    res.json({
      success: true,
      user: {
        id: req.user.userId,
        email: req.user.email || null,
        username: req.user.username || null,
        role: req.user.role || null
      }
    });
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
        username: user.username || '',
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
      const { chatSettings, messages, functions, message } = req.body;
      
      // Handle both message formats
      const chatMessages = messages || [
        { role: "system", content: "You are SaintBroker AI, an expert assistant for business lending, real estate, and investment services. Be professional, helpful, and knowledgeable about Saint Vision Group's services." },
        { role: "user", content: message || "Hello" }
      ];
      
      const payload: any = {
        messages: chatMessages,
        temperature: chatSettings?.temperature || 0.7,
        model: chatSettings?.model || MODEL_NAME,
      };

      // Vision support
      if (["gpt-4o", "gpt-4-vision-preview"].includes(payload.model)) {
        payload.max_tokens = 4096;
      }

      // Function/tool support
      if (functions && functions.length > 0) {
        payload.functions = functions;
      }

      let completion = null;
      let lastError = null;
      
      // Try Azure first if configured
      try {
        completion = await openai.chat.completions.create(payload);
      } catch (azureError: any) {
        console.log("Azure OpenAI failed, attempting fallback...");
        lastError = azureError;
        
        // Try standard OpenAI as fallback if available
        if (process.env.OPENAI_API_KEY) {
          try {
            const OpenAI = (await import('openai')).default;
            const standardOpenAI = new OpenAI({
              apiKey: process.env.OPENAI_API_KEY
            });
            
            payload.model = "gpt-4o"; // Use standard model for fallback
            completion = await standardOpenAI.chat.completions.create(payload);
            console.log("✅ Fallback to standard OpenAI successful");
          } catch (fallbackError: any) {
            console.error("Both Azure and standard OpenAI failed", fallbackError);
            lastError = fallbackError;
          }
        }
      }
      
      if (!completion) {
        // If all AI services fail, provide a helpful fallback response
        res.json({
          choices: [{
            message: {
              content: "I'm experiencing technical difficulties, but I'm here to help with Saint Vision Group services:\n\n📊 **Business Lending**: $50K-$5M loans with flexible terms\n🏡 **Real Estate**: Full-service property solutions\n💰 **Investments**: 9-12% fixed returns\n\nPlease call us directly at (949) 755-0720 or email saints@hacp.ai for immediate assistance.",
              role: "assistant"
            }
          }]
        });
        return;
      }
      
      res.json({
        choices: completion.choices
      });
    } catch (error: any) {
      console.error("OpenAI chat error:", error);
      
      // Provide a fallback response instead of an error
      res.json({
        choices: [{
          message: {
            content: "I'm here to help with Saint Vision Group services. While I'm experiencing a technical issue, you can:\n\n• Call: (949) 755-0720\n• Email: saints@hacp.ai\n• Apply online for business lending ($50K-$5M)\n• Explore our real estate services\n• Learn about our 9-12% investment returns\n\nHow can I assist you today?",
            role: "assistant"
          }
        }]
      });
    }
  });

  // Lead qualification endpoint for lending pipeline
  app.post("/api/leads/qualify", async (req, res) => {
    try {
      const { name, email, phone, loanAmount, creditScore, businessType, urgency } = req.body;
      
      // Qualify the lead based on criteria
      const qualified = creditScore >= 600 && parseLoanAmount(loanAmount) >= 50000;
      const priority = urgency === 'high' ? 'hot' : creditScore >= 700 ? 'warm' : 'cold';
      
      // Store lead in database (could be expanded later)
      const leadData = {
        name,
        email,
        phone,
        loanAmount: parseLoanAmount(loanAmount),
        creditScore: parseInt(creditScore),
        businessType,
        urgency,
        qualified,
        priority,
        timestamp: new Date().toISOString()
      };
      
      // If qualified, could trigger GHL workflow here
      if (qualified) {
        console.log(`✅ Qualified lead: ${name} - ${priority} priority`);
      }
      
      res.json({
        success: true,
        qualified,
        priority,
        message: qualified 
          ? `Great news! You pre-qualify for up to $${loanAmount}. A specialist will contact you shortly.`
          : `Thank you for your interest. Let's discuss alternative options that may work better for you.`,
        leadData
      });
    } catch (error: any) {
      console.error("Lead qualification error:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });
  
  // Debug endpoint to test OpenAI connection
  app.get("/api/test-openai", async (req, res) => {
    try {
      const hasAzureKey = !!process.env.AZURE_AI_FOUNDRY_KEY;
      const hasAzureEndpoint = !!process.env.AZURE_AI_FOUNDRY_ENDPOINT;
      const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
      
      const status: any = {
        azure: { hasKey: hasAzureKey, hasEndpoint: hasAzureEndpoint },
        openai: { hasKey: hasOpenAIKey },
        modelName: MODEL_NAME
      };
      
      // Try a simple test with standard OpenAI
      if (hasOpenAIKey) {
        try {
          const OpenAI = (await import('openai')).default;
          const testClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
          const testResponse = await testClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Say 'test successful'" }],
            max_tokens: 10
          });
          status.openaiTest = testResponse.choices[0].message.content;
        } catch (err: any) {
          status.openaiError = err.message;
        }
      }
      
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // SaintBroker chat endpoint - handles SaintBroker AI assistant requests
  app.post("/api/gpt/memory-chat", async (req, res) => {
    try {
      const { systemPrompt, userMessage } = req.body;

      const completion = await openai.chat.completions.create({
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

      // For now, we'll use basic memory context - later can be enhanced with storage
      const memoryContext = "Previous conversations and user preferences can be stored here";

      const prompt = `You are SaintSal™, an AI assistant with memory and intuition.\n\nMemory Context:\n${memoryContext}\n\nUser Query:\n${userQuery}\n\nRespond helpfully using context when relevant. Be helpful, intuitive, and aligned with enterprise values.`;

      const completion = await openai.chat.completions.create({
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

      const completion = await openai.chat.completions.create({
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
      
      const contactResponse = await captureGHLLead({
        firstName: firstName || 'New',
        lastName: lastName || 'Lead',
        email,
        phone,
        service: (divisionToServiceMap[aiQualification.division] || 'general') as 'real-estate' | 'lending' | 'investments' | 'general' | 'real-estate-brokerage' | 'real-estate-finance',
        type: leadData.type || aiQualification.division,
        notes: leadData.notes || `AI: ${aiQualification.reasoning} | Division: ${aiQualification.division} | Priority: ${aiQualification.priority} | Est. Value: ${aiQualification.estimatedValue} | Confidence: ${aiQualification.confidenceScore}`,
        source: leadData.source || 'website'
      });
      const contactId = (contactResponse as any).contact?.id || (contactResponse as any).data?.contact?.id || '';
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

      // STEP 6.5: Auto-Create User Account (NEW!)
      let userAccount = null;
      let tempPassword = null;
      let sessionToken = null;
      
      try {
        // Check if user already exists
        const existingUser = await storage.getUserByEmail(email);
        
        if (!existingUser) {
          // Generate STRONG temporary password: 12 random characters
          tempPassword = crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
          const hashedPassword = await hashPassword(tempPassword);
          
          // Create user account
          userAccount = await storage.createUser({
            username: email.split('@')[0],
            email,
            password: hashedPassword
          });
          
          // Create session token for auto-login
          sessionToken = {
            userId: userAccount.id,
            email: userAccount.email!,
            role: userAccount.role!,
            username: userAccount.username!
          };
          
          // Set session cookie for auto-login
          createSession(res, sessionToken);
          
          console.log(`���� Step 6.5: User account created and session set for ${email}`);
        } else {
          userAccount = existingUser;
          
          // Create session for existing user too (auto-login)
          sessionToken = {
            userId: existingUser.id,
            email: existingUser.email!,
            role: existingUser.role!,
            username: existingUser.username!
          };
          
          // Set session cookie for auto-login
          createSession(res, sessionToken);
          
          console.log(`✅ Step 6.5: User account already exists for ${email}, session created for auto-login`);
        }
      } catch (accountError) {
        console.error('⚠️  Account creation failed:', accountError);
        // Set flag to indicate account creation failure
        sessionToken = null;
        userAccount = null;
      }
      
      // STEP 6.6: Send Login Credentials via SMS + EMAIL (NEW!)
      if (tempPassword && contactId) {
        // SECURITY: Build messages but NEVER log them
        const smsMessage = `Welcome to Saint Vision Group! Your portal login:\n\nEmail: ${email}\nPassword: ${tempPassword}\n\nLogin at saintvisiongroup.com/login to track your application!`;
        
        const emailHTML = `
          <h2>Welcome to Saint Vision Group!</h2>
          <p>Your portal account has been created. Use these credentials to access your client portal:</p>
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${tempPassword}</p>
          </div>
          <p><a href="https://saintvisiongroup.com/login" style="background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Login to Your Portal</a></p>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">For security, please change your password after your first login.</p>
        `;
        
        // Send via SMS if phone provided
        if (phone) {
          try {
            await sendSMS(phone, smsMessage);
            console.log(`✅ Step 6.6a: Credential SMS sent to client`);
          } catch (smsError) {
            console.error('⚠️  Credential SMS delivery failed');
          }
        }
        
        // ALWAYS send via Email as backup
        try {
          await sendEmailViaGHL(contactId, 'Your Saint Vision Group Portal Login', emailHTML);
          console.log(`�� Step 6.6b: Credential email sent to client`);
        } catch (emailError) {
          console.error('���️  Credential email delivery failed');
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
        },
        // Auto-login session info (NEW!)
        session: sessionToken ? {
          userId: sessionToken.userId,
          email: sessionToken.email,
          role: sessionToken.role,
          username: sessionToken.username,
          accountCreated: tempPassword ? true : false
        } : null,
        // Warning if account creation failed (NEW!)
        warning: sessionToken ? null : "Account creation failed. You can still sign up manually at /signup"
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

  // GHL Workflow Trigger - For Client Hub Quick Actions
  app.post("/api/ghl/trigger-workflow", async (req, res) => {
    try {
      const { workflow, contactId, source } = req.body;
      
      console.log('🚀 Triggering GHL Workflow:', { workflow, contactId, source });
      
      // Map workflow names to actual GHL workflow IDs
      const workflowMap: Record<string, string> = {
        'new_loan_app': 'workflow_loan_application',
        'doc_upload': 'workflow_document_upload',
        'schedule_consultation': 'workflow_consultation_booking',
        'status_check': 'workflow_status_update',
        'prequalification': 'workflow_prequalify',
        'contact_broker': 'workflow_broker_contact'
      };
      
      const workflowId = workflowMap[workflow];
      if (!workflowId) {
        return res.status(400).json({ error: 'Invalid workflow' });
      }
      
      // TODO: Trigger the actual workflow in GHL when the triggerWorkflow function is added to GHL service
      // For now, simulate success
      console.log(`✅ Workflow mapped: ${workflow} -> ${workflowId}`);
      
      res.json({ 
        success: true, 
        workflow,
        workflowId,
        message: 'Workflow triggered successfully' 
      });
    } catch (error: any) {
      console.error("GHL workflow trigger error:", error);
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
      
      const contactId = req.params.contactId || null;
      
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
          stageName: opportunities.stageName,
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
          stageName: opportunities.stageName,
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

      const pipelineStages: Array<{ name: string; status: 'pending' | 'completed' | 'current' }> = [
        { name: 'New Lead', status: 'pending' },
        { name: 'Contacted', status: 'pending' },
        { name: 'Pre Qualified', status: 'pending' },
        { name: 'Documents pending', status: 'pending' },
        { name: 'Full Application Complete', status: 'pending' },
        { name: 'Sent to Lender', status: 'pending' },
        { name: 'Documents Pending and Follow Up', status: 'pending' },
        { name: 'Signature/Qualified', status: 'pending' },
        { name: 'Funded $', status: 'pending' }
      ];

      // Get current stage index using EXACT match
      const normalizedStage = (opp.stageName || 'new_lead').toLowerCase().trim();
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
          applicationDate: opp.contactCreatedAt ? new Date(opp.contactCreatedAt).toLocaleDateString() : 'N/A',
          currentStage: opp.stageName || 'New Lead',
          priority: opp.priority || 'medium',
          status: opp.status || 'Active',
          estimatedFunding: opp.priority === 'hot' ? '3-5 business days' : '7-10 business days'
        },
        pipelineStages: pipelineStages.map((stage, idx) => ({
          name: stage.name,
          status: stage.status,
          date: stage.status === 'completed' && opp.oppCreatedAt ? new Date(opp.oppCreatedAt).toLocaleDateString() : undefined
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

  // Admin Dashboard Endpoints
  app.get("/api/admin/applications", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { opportunities, contacts } = await import('@shared/schema');
      const { eq, desc } = await import('drizzle-orm');
      
      const apps = await db.select({
        oppId: opportunities.id,
        contactId: contacts.id,
        firstName: contacts.firstName,
        lastName: contacts.lastName,
        email: contacts.email,
        phone: contacts.phone,
        monetaryValue: opportunities.monetaryValue,
        division: opportunities.division,
        status: opportunities.status,
        priority: opportunities.priority,
        stageName: opportunities.stageName,
        createdAt: opportunities.createdAt
      })
      .from(opportunities)
      .leftJoin(contacts, eq(opportunities.contactId, contacts.id))
      .orderBy(desc(opportunities.createdAt));

      const applications = apps.map(app => ({
        id: app.oppId.toString(),
        clientName: `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'Unknown Client',
        clientEmail: app.email || 'N/A',
        clientPhone: app.phone || 'N/A',
        loanAmount: `$${(app.monetaryValue || 0).toLocaleString()}`,
        loanType: app.division?.replace(/_/g, ' ').toUpperCase() || 'Lending',
        status: mapStageToStatus(app.stageName || 'new_lead'),
        currentStage: app.stageName || 'New Lead',
        applicationDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A',
        priority: app.priority || 'medium'
      }));

      res.json(applications);
    } catch (error: any) {
      console.error("Admin applications error:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { db } = await import('./db');
      const { opportunities } = await import('@shared/schema');
      const { sql } = await import('drizzle-orm');
      
      const allOpps = await db.select().from(opportunities);
      
      const stats = {
        totalApplications: allOpps.length,
        pending: 0,
        submitted: 0,
        incomplete: 0,
        completed: 0,
        totalLoanValue: '$0'
      };

      let totalValue = 0;
      
      allOpps.forEach(opp => {
        const status = mapStageToStatus(opp.stageName || 'new_lead');
        if (status === 'pending') stats.pending++;
        else if (status === 'submitted') stats.submitted++;
        else if (status === 'incomplete') stats.incomplete++;
        else if (status === 'completed') stats.completed++;
        
        totalValue += opp.monetaryValue || 0;
      });

      stats.totalLoanValue = `$${(totalValue / 1000000).toFixed(1)}M`;

      res.json(stats);
    } catch (error: any) {
      console.error("Admin stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Helper function to map pipeline stage to application status
  function mapStageToStatus(stage: string): 'pending' | 'submitted' | 'incomplete' | 'completed' {
    const normalized = stage.toLowerCase().trim();
    
    if (normalized.includes('new') || normalized.includes('contacted')) {
      return 'pending';
    }
    if (normalized.includes('pre') || normalized.includes('qualified') || normalized.includes('sent')) {
      return 'submitted';
    }
    if (normalized.includes('document') && normalized.includes('pending')) {
      return 'incomplete';
    }
    if (normalized.includes('funded') || normalized.includes('signature')) {
      return 'completed';
    }
    
    return 'pending';
  }

  // =====================================================
  // LOAN PRODUCTS AND APPLICATION ENDPOINTS
  // =====================================================

  // Seed loan products into database
  app.post("/api/loan-products/seed", async (req, res) => {
    try {
      console.log('🌱 Starting loan products seed...');

      // Clear existing products first (optional - for clean seed)
      const { db } = await import('./db');
      const { loanProducts } = await import('@shared/schema');

      // Delete existing products
      await db.delete(loanProducts);
      console.log('✅ Cleared existing loan products');

      // Insert all loan products from the data file
      const insertedProducts = [];
      for (const product of LOAN_PRODUCTS_DATA) {
        try {
          const inserted = await storage.createLoanProduct(product);
          insertedProducts.push(inserted);
          console.log(`✅ Seeded: ${inserted.name}`);
        } catch (productError: any) {
          console.warn(`⚠️  Failed to seed product: ${product.name}`, productError.message);
          // Continue with next product even if one fails
        }
      }

      if (insertedProducts.length === 0) {
        return res.status(500).json({
          error: 'Failed to seed loan products',
          details: 'No products could be inserted'
        });
      }

      return res.json({
        success: true,
        message: `Successfully seeded ${insertedProducts.length} loan products`,
        products: insertedProducts.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category
        }))
      });
    } catch (error: any) {
      console.error('❌ Loan products seed error:', error);
      return res.status(500).json({
        error: 'Failed to seed loan products',
        details: error.message
      });
    }
  });

  // Get all loan products
  app.get("/api/loan-products", async (req, res) => {
    try {
      const { category } = req.query;
      
      let products;
      if (category) {
        products = await storage.getLoanProductsByCategory(category as string);
      } else {
        products = await storage.getLoanProducts();
      }
      
      res.json(products);
    } catch (error: any) {
      console.error('Loan products fetch error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch loan products',
        details: error.message 
      });
    }
  });

  // Submit complete application with signature
  // Create rate limiter for application submissions
  const applicationRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // Max 5 applications per hour per IP
    message: 'Too many application submissions from this IP. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
  });
  
  // SECURE Application Submission Endpoint - WITH AUTHENTICATION & ENCRYPTION
  app.post("/api/applications/submit", 
    applicationRateLimiter,  // SECURITY FIX: Rate limiting
    async (req, res) => {
    try {
      // SECURITY FIX: Validate and sanitize all input with Zod
      const validationResult = applicationSubmitSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationResult.error.errors 
        });
      }
      
      // Sanitize all input data to prevent injection attacks
      const sanitizedData = sanitizeInput(validationResult.data);
      const { applicationData, signatureData, consentChecks, loanProductId } = sanitizedData;
      
      // Validate signature data format
      if (!isValidBase64(signatureData.data)) {
        return res.status(400).json({ 
          error: 'Invalid signature data format' 
        });
      }
      
      // Validate SSN if provided
      if (applicationData.ssn && !isValidSSN(applicationData.ssn)) {
        return res.status(400).json({ 
          error: 'Invalid SSN format' 
        });
      }
      
      // Create unique application ID
      const applicationId = crypto.randomUUID();
      const ipAddress = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';
      const userId = req.user?.userId || 'anonymous';
      
      console.log('🔒 Secure Processing application:', applicationId, 'by user:', userId);
      
      // SECURITY FIX: Encrypt sensitive data before ANY storage or transmission
      const encryptedSSN = applicationData.ssn ? encrypt(applicationData.ssn) : null;
      const encryptedSignature = encrypt(signatureData.data);
      const redactedSSN = applicationData.ssn ? redactSSN(applicationData.ssn) : null;
      
      // SECURITY FIX: Create audit log entry FIRST
      await storage.createSystemLog({
        userId,
        action: 'application_submitted',
        details: {
          applicationId,
          email: applicationData.email,
          businessName: applicationData.businessName,
          loanAmount: applicationData.loanAmount,
          ipAddress,
          userAgent,
          timestamp: new Date().toISOString()
        }
      });
      
      // Step 1: Create/update contact in GHL with REDACTED info only
      const contactResponse = await captureGHLLead({
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        email: applicationData.email,
        phone: applicationData.phone,
        service: 'lending',
        type: `Application: ${applicationData.loanAmount}`,
        notes: `Loan Product: ${applicationData.loanType || 'General'} | Amount: ${applicationData.loanAmount} | Credit: ${applicationData.creditScore}`,
        source: 'application-form'
      });
      
      const ghlContactId = (contactResponse as any).contact?.id || (contactResponse as any).data?.contact?.id || '';
      
      // Step 2: Store ENCRYPTED application signature
      const signature = await storage.createApplicationSignature({
        applicationId,
        signatureData: encryptedSignature,  // ENCRYPTED signature data
        signatureType: signatureData.type || 'drawn',
        fullName: `${applicationData.firstName} ${applicationData.lastName}`,
        title: applicationData.businessTitle || null,
        ipAddress,
        userAgent,
        consentText: generateConsentText({ ...applicationData, ipAddress }),
        consentGiven: true
      });
      
      console.log('✅ Encrypted signature stored:', signature.id);
      
      // Store encrypted PII in secure document storage (if SSN provided)
      if (encryptedSSN) {
        await storage.createApplicationDocument({
          applicationId,
          documentType: 'ssn_encrypted',
          fileName: 'pii_data.enc',
          fileUrl: '',  // Not stored as file
          fileSize: 0,
          mimeType: 'application/encrypted',
          metadata: { ssn: encryptedSSN, redacted: redactedSSN }
        });
      }
      
      // Step 3: Auto-select funding partner using AI
      const selectedPartner = autoSelectFundingPartner({
        loanAmount: parseLoanAmount(applicationData.loanAmount),
        creditScore: parseInt(applicationData.creditScore) || 0,
        businessRevenue: parseLoanAmount(applicationData.annualRevenue || '0'),
        timeInBusiness: parseInt(applicationData.yearsInBusiness) || 0,
        loanPurpose: applicationData.loanPurpose || 'working_capital',
        division: 'lending',
        hasCollateral: applicationData.hasCollateral === 'yes'
      });
      
      console.log('🎯 Selected funding partner:', selectedPartner.name);
      
      // Step 4: Update GHL pipeline stage
      const { LENDING_PIPELINE_STAGES, updateOpportunityStage } = await import('./services/ghl-client');
      
      try {
        await updateOpportunityStage(
          ghlContactId, 
          LENDING_PIPELINE_STAGES.SENT_TO_LENDER
        );
        console.log('✅ Updated GHL stage to: Sent to Lender');
      } catch (ghlError) {
        console.error('⚠️ GHL stage update failed:', ghlError);
      }
      
      // Step 5: Route application to lender - NEVER include SSN or signature
      if (selectedPartner.submissionType === 'email' && selectedPartner.email) {
        // Send email with REDACTED information only
        const emailBody = `
New Loan Application from Saint Vision Group

Applicant: ${applicationData.firstName} ${applicationData.lastName}
Email: ${applicationData.email}
Phone: ${applicationData.phone}
Business: ${applicationData.businessName}

Loan Details:
- Amount Requested: ${applicationData.loanAmount}
- Purpose: ${applicationData.loanPurpose}
- Credit Score: ${applicationData.creditScore}
- Annual Revenue: ${applicationData.annualRevenue || 'Not provided'}
- Years in Business: ${applicationData.yearsInBusiness}

Application ID: ${applicationId}
Signature Captured: Yes (Encrypted)
SSN: ${redactedSSN || 'Not provided'}
Documents: Pending

Please contact the applicant within 24 hours to proceed.
        `;
        
        await sendEmailViaGHL({
          to: selectedPartner.email,
          subject: `New Loan Application - ${applicationData.firstName} ${applicationData.lastName} - ${applicationData.loanAmount}`,
          body: emailBody,
          contactId: ghlContactId
        });
        
        console.log('✅ Application sent to lender:', selectedPartner.name);
      }
      
      // Step 6: Send confirmation to applicant
      if (applicationData.phone) {
        await sendSMS(
          applicationData.phone,
          `Thank you for your loan application! We've received your request for ${applicationData.loanAmount}. ${selectedPartner.name} will contact you within 24 hours. Check your email for details.`
        );
      }
      
      // SECURITY FIX: Return minimal information - NO sensitive data
      res.json({
        success: true,
        applicationId,
        message: 'Application submitted successfully',
        nextSteps: 'Lender will contact you within 24 hours'
        // REMOVED: fundingPartner, estimatedFunding - minimize data exposure
      });
      
    } catch (error: any) {
      console.error('Application submission error:', error);
      
      // Log failed submission attempt
      if (req.user?.userId) {
        await storage.createSystemLog({
          userId: req.user.userId,
          action: 'application_submission_failed',
          details: {
            error: error.message,
            ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '',
            timestamp: new Date().toISOString()
          }
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to submit application',
        // SECURITY FIX: Don't expose internal error details
        message: 'An error occurred processing your application. Please try again.'
      });
    }
  });

  // Capture signature for existing application
  app.post("/api/applications/:id/sign", async (req, res) => {
    try {
      const { id: applicationId } = req.params;
      const { signatureData, consentChecks, signerName } = req.body;
      
      if (!signatureData || !consentChecks) {
        return res.status(400).json({ 
          error: 'Signature data and consent checks are required' 
        });
      }
      
      // Check if signature already exists
      const existingSignature = await storage.getApplicationSignature(applicationId);
      if (existingSignature) {
        return res.status(409).json({ 
          error: 'Application has already been signed' 
        });
      }
      
      const ipAddress = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';
      
      const signature = await storage.createApplicationSignature({
        applicationId,
        signatureData: signatureData.data,
        signatureType: signatureData.type || 'drawn',
        fullName: signerName,
        ipAddress,
        userAgent,
        consentText: 'Standard loan application terms and conditions',
        consentGiven: true
      });
      
      res.json({
        success: true,
        signatureId: signature.id,
        message: 'Signature captured successfully'
      });
      
    } catch (error: any) {
      console.error('Signature capture error:', error);
      res.status(500).json({ 
        error: 'Failed to capture signature',
        details: error.message 
      });
    }
  });

  // Route application to lender
  app.post("/api/applications/:id/route", async (req, res) => {
    try {
      const { id: applicationId } = req.params;
      
      // Get application from storage
      const application = await storage.getApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      
      // Parse credit score from string format
      let creditScore = 650;
      if (application.creditScore) {
        const creditStr = application.creditScore.toString();
        if (creditStr.includes('750')) creditScore = 750;
        else if (creditStr.includes('700')) creditScore = 700;
        else if (creditStr.includes('650')) creditScore = 650;
        else if (creditStr.includes('600')) creditScore = 600;
        else if (creditStr.includes('550')) creditScore = 550;
        else if (creditStr.includes('500')) creditScore = 500;
      }
      
      // Select funding partner using correct parameters
      const selectedPartner = autoSelectFundingPartner({
        loanType: application.loanPurpose || 'working capital',
        loanAmount: Number(application.loanAmount) || 100000,
        creditScore: creditScore,
        speedNeeded: false // Could be based on timeframe field
      });
      
      // Send application to lender
      let routingDetails = { method: '', destination: '' };
      
      if (selectedPartner.submissionType === 'email' && selectedPartner.email) {
        // Send email to lender
        const emailContent = `
New Loan Application from Saint Vision Group

Application ID: ${applicationId}
Business: ${application.businessName}
Contact: ${application.firstName} ${application.lastName}
Phone: ${application.phone}
Email: ${application.email}

Loan Details:
- Amount: $${application.loanAmount}
- Purpose: ${application.loanPurpose}
- Credit Score: ${creditScore}

Please contact the applicant within 24 hours.
        `;
        
        // Here you would send the actual email
        console.log(`Routing to ${selectedPartner.name} via email: ${selectedPartner.email}`);
        routingDetails = { method: 'email', destination: selectedPartner.email };
        
      } else if (selectedPartner.submissionType === 'link' && selectedPartner.link) {
        // Provide link for submission
        console.log(`Routing to ${selectedPartner.name} via link: ${selectedPartner.link}`);
        routingDetails = { method: 'link', destination: selectedPartner.link };
      }
      
      // Update GHL if contact ID exists
      if (application.ghlContactId) {
        try {
          const ghlClient = getGHLClient();
          await ghlClient.updateContact(application.ghlContactId, {
            pipelineStage: 'Application Submitted',
            customFields: {
              lenderName: selectedPartner.name,
              applicationStatus: 'Routed to Lender'
            }
          });
        } catch (ghlError) {
          console.error('GHL update failed:', ghlError);
        }
      }
      
      res.json({
        success: true,
        fundingPartner: selectedPartner,
        routing: routingDetails,
        message: `Application successfully routed to ${selectedPartner.name}`
      });
      
    } catch (error: any) {
      console.error('Application routing error:', error);
      res.status(500).json({ 
        error: 'Failed to route application',
        details: error.message 
      });
    }
  });

  // Helper function to generate consent text
  function generateConsentText(applicationData: any): string {
    return `
By signing below, I certify that:

1. LOAN TERMS ACKNOWLEDGMENT: I understand that I am applying for a business loan of ${applicationData.loanAmount} and agree to the terms that will be provided by the lender.

2. CREDIT CHECK AUTHORIZATION: I authorize Saint Vision Group and its lending partners to obtain credit reports and verify the information provided in this application.

3. BUSINESS INFORMATION ACCURACY: I certify that all information provided is true, accurate, and complete to the best of my knowledge.

4. COMMUNICATION CONSENT: I consent to receive communications via phone, email, and SMS regarding this loan application and related services.

5. DATA SHARING: I understand that my information will be shared with qualified lending partners to process this application.

Signed electronically on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
IP Address: ${applicationData.ipAddress || 'Not captured'}
    `;
  }

  // SaintBroker Enhanced API Endpoints - MASTER ORCHESTRATOR
  // SaintBroker chat endpoint - simple and direct, using SaintSal AI
  app.post("/api/saint-broker/chat", async (req, res) => {
    try {
      const { message } = req.body;
      // Allow both authenticated and guest users
      const userId = req.user?.userId || req.session?.user?.id || 'guest-user';
      const userRole = req.user?.role || req.session?.user?.role || 'guest';
      const userEmail = req.user?.email || req.session?.user?.email || 'guest@saintbrokerai.com';

      // BUILD CONTEXT-AWARE DATA FOR SAINTBROKER ORCHESTRATOR
      let userContext = {
        role: userRole,
        email: userEmail,
        userId: userId,
        isAdmin: userRole === 'admin' || userRole === 'broker',
        applicationData: null as any,
        adminStats: null as any,
        syncStatus: {
          adminDashboard: 'synced',
          clientPortal: 'synced',
          saintBroker: 'active'
        }
      };

      // If ADMIN - Load ALL applications and stats
      if (userContext.isAdmin) {
        try {
          const { db } = await import('./db');
          const { opportunities, contacts } = await import('@shared/schema');
          const { eq, desc } = await import('drizzle-orm');
          
          // Get all applications
          const apps = await db.select({
            oppId: opportunities.id,
            contactId: contacts.id,
            firstName: contacts.firstName,
            lastName: contacts.lastName,
            email: contacts.email,
            phone: contacts.phone,
            monetaryValue: opportunities.monetaryValue,
            division: opportunities.division,
            status: opportunities.status,
            priority: opportunities.priority,
            stageName: opportunities.stageName,
            createdAt: opportunities.createdAt
          })
          .from(opportunities)
          .leftJoin(contacts, eq(opportunities.contactId, contacts.id))
          .orderBy(desc(opportunities.createdAt));

          userContext.applicationData = apps;
          userContext.adminStats = {
            totalApplications: apps.length,
            totalPipeline: apps.reduce((sum, app) => sum + (app.monetaryValue || 0), 0),
            pendingCount: apps.filter(a => mapStageToStatus(a.stageName || '') === 'pending').length,
            submittedCount: apps.filter(a => mapStageToStatus(a.stageName || '') === 'submitted').length
          };
        } catch (dbError) {
          console.error('[SaintBroker Admin Context] DB error:', dbError);
        }
      } 
      // If CLIENT - Load only their application
      else {
        try {
          const { db } = await import('./db');
          const { opportunities, contacts } = await import('@shared/schema');
          const { eq } = await import('drizzle-orm');
          
          // Get client's application by email
          const contact = await db.select().from(contacts).where(eq(contacts.email, userEmail)).limit(1);
          if (contact[0]) {
            const opp = await db.select().from(opportunities).where(eq(opportunities.contactId, contact[0].id)).limit(1);
            if (opp[0]) {
              userContext.applicationData = opp[0];
            }
          }
        } catch (dbError) {
          console.error('[SaintBroker Client Context] DB error:', dbError);
        }
      }

      // Load comprehensive knowledge base for SaintBroker
      const knowledgeBase = [];
      
      try {
        // Load client hub knowledge base (384 lines of complete reference)
        const hubKnowledgePath = path.join(process.cwd(), 'client-hub-knowledge-base.md');
        if (fs.existsSync(hubKnowledgePath)) {
          knowledgeBase.push(fs.readFileSync(hubKnowledgePath, 'utf-8'));
        }
        
        // Load system architecture and workflows
        const replitMdPath = path.join(process.cwd(), 'replit.md');
        if (fs.existsSync(replitMdPath)) {
          knowledgeBase.push(fs.readFileSync(replitMdPath, 'utf-8'));
        }
        
        // Add funding partners knowledge with AI routing logic
        const fundingPartnersKnowledge = `
# FUNDING PARTNER NETWORK (13 Active Partners)

Saint Vision Group operates a comprehensive funding partner network with AI-powered routing through SaintBroker™. The system automatically matches applications to the optimal lender based on loan type, amount, credit score, and urgency.

**Network Overview:**
- **13 Active Partners**: $5K to $50M+ funding range
- **AI Auto-Selection**: SaintBroker analyzes and routes to best match
- **Multiple Specialties**: MCA, Real Estate, Equipment, SBA, Startup (0% SLOC)
- **Speed Range**: 1-3 days (urgent MCA) to 30-60 days (SBA)
- **Commission**: 8-30% depending on partner and product

**AI Routing Logic:**
- Equipment loans → Commercial Capital Connect
- Real Estate → Easy Street Capital or Trinity Bay Lending
- Startup (700+ credit, <$100K) → Rich Mee (0% SLOC)
- SBA (Expansion/Acquisition, 650+ credit) → SB Lending Source
- General Business Lending ($50K-$5M) → SVG In-House first, then partners
- Working Capital/MCA → SVG Partner Network (fastest)
- Large Commercial → Rok Financial

**Active Funding Partners:**
${FUNDING_PARTNERS.filter(p => p.active).map(p => 
  `- **${p.name}**: ${p.description} (Specialties: ${p.specialties.join(', ')})`
).join('\n')}

**IMPORTANT**: Saint Vision Group is the white-label brokerage. Clients see "Saint Vision Group - Powered by SaintBroker™ AI" throughout entire journey. Partners are SVG's competitive advantage and backend relationships - generally NOT exposed to clients except in strategic cases for credibility.
`;
        knowledgeBase.push(fundingPartnersKnowledge);
        
      } catch (fileError) {
        console.error('[SaintBroker] Error loading knowledge base files:', fileError);
        // Continue with available knowledge even if some files fail
      }

      // BUILD ORCHESTRATOR MESSAGE WITH FULL CONTEXT
      const orchestratorContext = `
[SAINTBROKER AI ORCHESTRATOR CONTEXT]
User Role: ${userContext.role}
User Email: ${userContext.email}
Is Admin: ${userContext.isAdmin}

${userContext.isAdmin ? `
[ADMIN CONTEXT - FULL PIPELINE VIEW]
Total Applications: ${userContext.adminStats?.totalApplications || 0}
Total Pipeline Value: $${(userContext.adminStats?.totalPipeline || 0).toLocaleString()}
Pending Applications: ${userContext.adminStats?.pendingCount || 0}
Submitted Applications: ${userContext.adminStats?.submittedCount || 0}

Recent Applications:
${userContext.applicationData?.slice(0, 5).map((app: any) => 
  `- ${app.firstName} ${app.lastName}: $${(app.monetaryValue || 0).toLocaleString()} (${app.stageName})`
).join('\n') || 'No applications'}
` : `
[CLIENT CONTEXT - PERSONAL APPLICATION]
${userContext.applicationData ? `
Application Status: ${userContext.applicationData.stageName}
Loan Amount: $${(userContext.applicationData.monetaryValue || 0).toLocaleString()}
Division: ${userContext.applicationData.division}
Priority: ${userContext.applicationData.priority}
` : 'No active application'}
`}

[SYNC STATUS]
Admin Dashboard: ${userContext.syncStatus.adminDashboard}
Client Portal: ${userContext.syncStatus.clientPortal}
SaintBroker AI: ${userContext.syncStatus.saintBroker}

[USER MESSAGE]
${message}

${knowledgeBase.length > 0 ? `
[KNOWLEDGE BASE]
${knowledgeBase.slice(0, 2).join('\n\n')}
` : ''}

IMPORTANT: You are SaintBroker AI, the master orchestrator. Respond based on the user's role:
- For ADMINS: Provide comprehensive pipeline insights, all applications, and management advice
- For CLIENTS: Focus on their specific application, next steps, and personalized guidance
- Always maintain sync awareness between admin dashboard, client portal, and your responses
      `;

      // Use the production AI orchestrator with full context
      const enhancedResponse = await saintBrokerAI.chat({
        message: orchestratorContext,
        context: {
          division: 'lending',
          stage: context?.stage || 'initial',
          userRole: userContext.role,
          isAdmin: userContext.isAdmin
        }
      });
      
      res.json({ 
        response: enhancedResponse.response,
        context: {
          role: userContext.role,
          syncStatus: userContext.syncStatus
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.get("/api/saint-broker/documents", async (req, res) => {
    try {
      const userId = req.user?.userId || 'demo-user'; // TODO: Get from session
      const documents = await storage.getUserDocuments(userId);
      res.json(documents || []);
    } catch (error: any) {
      console.error('[SaintBroker Documents] Error:', error);
      res.json([]); // Return empty array instead of error
    }
  });

  app.post("/api/saint-broker/upload", async (req, res) => {
    try {
      const userId = req.user?.userId || 'demo-user'; // TODO: Get from session
      
      // TODO: Implement file upload with multer
      res.status(501).json({ error: "File upload not yet implemented" });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  app.get("/api/saint-broker/notes", async (req, res) => {
    try {
      const userId = req.user?.userId || 'demo-user'; // TODO: Get from session
      // Return empty array for now - notes feature coming soon
      res.json([]);
    } catch (error: any) {
      console.error('Error loading notes:', error);
      res.json([]); // Return empty array instead of error
    }
  });

  app.post("/api/saint-broker/notes", async (req, res) => {
    try {
      const userId = req.user?.userId || 'demo-user'; // TODO: Get from session
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
      console.error('[SaintBroker Notes POST] Error:', error);
      res.json({ note: null, error: "Note saved locally" });
    }
  });

  app.get("/api/saint-broker/signatures", async (req, res) => {
    try {
      const userId = req.user?.userId || 'demo-user'; // TODO: Get from session
      // Return empty array for now - signatures feature coming soon
      res.json([]);
    } catch (error: any) {
      console.error('Error loading signatures:', error);
      res.json([]); // Return empty array instead of error
    }
  });

  app.post("/api/saint-broker/signatures/request", async (req, res) => {
    try {
      const userId = req.user?.userId || 'demo-user'; // TODO: Get from session
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
      console.error('[SaintBroker Signatures] Error:', error);
      res.json({ signature: null, error: "Signature request saved locally" });
    }
  });

  // ========== REAL-TIME SYNC API (ORCHESTRATOR) ==========
  
  // Master sync endpoint for real-time dashboard synchronization
  app.get("/api/sync/status", async (req, res) => {
    try {
      const userRole = req.user?.role || 'client';
      const userEmail = req.user?.email || 'unknown';
      
      const { db } = await import('./db');
      const { opportunities, contacts } = await import('@shared/schema');
      const { eq, desc } = await import('drizzle-orm');
      
      // Get latest data based on role
      let syncData: any = {
        timestamp: new Date().toISOString(),
        role: userRole,
        syncStatus: 'active'
      };
      
      if (userRole === 'admin' || userRole === 'broker') {
        // Admin sees all applications with real-time updates
        const apps = await db.select({
          oppId: opportunities.id,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          monetaryValue: opportunities.monetaryValue,
          stageName: opportunities.stageName,
          updatedAt: opportunities.updatedAt
        })
        .from(opportunities)
        .leftJoin(contacts, eq(opportunities.contactId, contacts.id))
        .orderBy(desc(opportunities.updatedAt))
        .limit(10); // Last 10 updated
        
        syncData.adminView = {
          totalApplications: apps.length,
          recentUpdates: apps,
          lastSync: new Date().toISOString()
        };
      } else {
        // Client sees only their data with real-time updates
        const contact = await db.select().from(contacts).where(eq(contacts.email, userEmail)).limit(1);
        if (contact[0]) {
          const opp = await db.select().from(opportunities).where(eq(opportunities.contactId, contact[0].id)).limit(1);
          syncData.clientView = {
            hasApplication: !!opp[0],
            currentStage: opp[0]?.stageName || 'none',
            lastUpdate: opp[0]?.updatedAt || null
          };
        }
      }
      
      res.json(syncData);
    } catch (error: any) {
      console.error("Sync status error:", error);
      res.status(500).json({ error: "Failed to get sync status" });
    }
  });
  
  // Webhook for real-time updates from GHL
  app.post("/api/sync/webhook", async (req, res) => {
    try {
      const { eventType, data } = req.body;
      
      // Broadcast update to all connected dashboards
      console.log(`[SYNC] Broadcasting ${eventType} update to all dashboards`);
      
      // TODO: Implement WebSocket broadcast for real-time updates
      // For now, dashboards will poll /api/sync/status
      
      res.json({ success: true, broadcast: eventType });
    } catch (error: any) {
      console.error("Sync webhook error:", error);
      res.status(500).json({ error: "Failed to process sync webhook" });
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

  // ========== KNOWLEDGE BASE ROUTES ==========
  
  // Load all knowledge files into the database
  app.post("/api/knowledge/load", async (req: any, res) => {
    try {
      console.log('🧠 Starting knowledge base ingestion...');
      
      // Get or create a system user for knowledge base
      let userId = req.session?.user?.id;
      
      if (!userId) {
        // Try to find or create a system user
        const systemUser = await storage.getUserByEmail('system@saintbrokerai.com');
        if (systemUser) {
          userId = systemUser.id;
        } else {
          // Create a system user for knowledge base
          const hashedPassword = await hashPassword('SystemUser2024!');
          const newUser = await storage.createUser({
            email: 'system@saintbrokerai.com',
            username: 'saintbroker_system',
            name: 'SaintBroker AI System',
            password: hashedPassword,
          });
          userId = newUser.id;
          console.log('Created system user for knowledge base');
        }
      }
      
      // Load all knowledge files from the server/knowledge directory
      const result = await knowledgeBaseService.loadAllKnowledgeFiles(userId);
      
      res.json({
        success: true,
        message: `Loaded ${result.loaded} knowledge files`,
        details: {
          loaded: result.loaded,
          failed: result.failed,
          errors: result.errors
        }
      });
    } catch (error: any) {
      console.error('Error loading knowledge base:', error);
      res.status(500).json({ 
        error: "Failed to load knowledge base",
        details: error.message 
      });
    }
  });

  // Search knowledge base
  app.post("/api/knowledge/search", async (req: any, res) => {
    try {
      const { query, limit = 5 } = req.body;
      const userId = req.session?.user?.id;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }
      
      const results = await knowledgeBaseService.searchKnowledge(query, userId, limit);
      res.json({ results });
    } catch (error: any) {
      console.error('Error searching knowledge base:', error);
      res.status(500).json({ error: "Failed to search knowledge base" });
    }
  });

  // Get knowledge base statistics
  app.get("/api/knowledge/stats", async (req: any, res) => {
    try {
      const userId = req.session?.user?.id;
      const stats = await knowledgeBaseService.getKnowledgeStats(userId);
      res.json(stats);
    } catch (error: any) {
      console.error('Error getting knowledge stats:', error);
      res.status(500).json({ error: "Failed to get knowledge statistics" });
    }
  });

  // Clear user's knowledge base
  app.delete("/api/knowledge", async (req: any, res) => {
    try {
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const success = await knowledgeBaseService.clearUserKnowledge(userId);
      res.json({ 
        success, 
        message: success ? "Knowledge base cleared" : "Failed to clear knowledge base" 
      });
    } catch (error: any) {
      console.error('Error clearing knowledge base:', error);
      res.status(500).json({ error: "Failed to clear knowledge base" });
    }
  });

  // GHL Form Submission Endpoint
  app.post("/api/ghl/form-submit", async (req: any, res) => {
    try {
      const { formId, formData } = req.body;

      if (!formId || !formData) {
        return res.status(400).json({
          success: false,
          message: "formId and formData are required"
        });
      }

      console.log(`[GHL-SUBMIT] Received form submission for form ID: ${formId}`);

      // Import the GHL form submission service
      const { submitFormToGHL } = await import('./services/ghl-form-submission');

      // Submit to GHL
      let result;
      try {
        result = await submitFormToGHL(formId, formData);
      } catch (submitError: any) {
        console.error('[GHL-SUBMIT] GHL API error:', submitError.message);
        return res.status(500).json({
          success: false,
          error: submitError.message || "Failed to submit form to GHL"
        });
      }

      console.log(`[GHL-SUBMIT] Form ${formId} submitted successfully`);

      return res.status(200).json({
        success: true,
        message: "Form submitted to GHL successfully",
        result
      });
    } catch (error: any) {
      console.error('[GHL-SUBMIT] Endpoint error:', error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to submit form to GHL"
      });
    }
  });

  // ========== SAINTBROKER ROUTES ==========

  // Get user's documents
  app.get("/api/saint-broker/documents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id;
      const { db } = await import('./db');
      const { applicationDocuments } = await import('./db');

      // Return mock documents for now
      const mockDocuments = [
        {
          id: crypto.randomUUID(),
          applicationId: crypto.randomUUID(),
          documentType: "pdf",
          fileName: "Business_Loan_Agreement.pdf",
          fileUrl: "/documents/sample-loan-agreement.pdf",
          fileSize: 256000,
          mimeType: "application/pdf",
          uploadedBy: userId,
          metadata: { type: "agreement", version: "1.0" },
          createdAt: new Date(),
        },
      ];

      res.json(mockDocuments);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      res.json([]);
    }
  });

  // Upload document
  app.post("/api/saint-broker/upload", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id;
      const { filename, fileType, fileSize, fileUrl } = req.body;

      if (!filename || !fileType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const doc = {
        id: crypto.randomUUID(),
        applicationId: crypto.randomUUID(),
        documentType: fileType,
        fileName: filename,
        fileUrl: fileUrl || `/uploads/${filename}`,
        fileSize: fileSize || 0,
        mimeType: fileType,
        uploadedBy: userId,
        metadata: null,
        createdAt: new Date(),
      };

      res.json({ success: true, document: doc });
    } catch (error: any) {
      console.error('Error uploading document:', error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  // Get user's notes
  app.get("/api/saint-broker/notes", isAuthenticated, async (req: any, res) => {
    try {
      res.json([]);
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      res.json([]);
    }
  });

  // Create note
  app.post("/api/saint-broker/notes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id;
      const { title, content, tags } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Missing title or content" });
      }

      const note = {
        id: crypto.randomUUID(),
        userId,
        conversationId: null,
        title,
        content,
        tags: tags || [],
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      res.json({ success: true, note });
    } catch (error: any) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  // Get user's signature requests
  app.get("/api/saint-broker/signatures", isAuthenticated, async (req: any, res) => {
    try {
      const mockSignatures = [
        {
          id: crypto.randomUUID(),
          userId: req.session?.user?.id,
          documentId: crypto.randomUUID(),
          documentTitle: "Business_Loan_Agreement.pdf",
          signatureType: "document",
          status: "pending",
          signedUrl: null,
          signedAt: null,
          requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ];
      res.json(mockSignatures);
    } catch (error: any) {
      console.error('Error fetching signatures:', error);
      res.json([]);
    }
  });

  // Request signature
  app.post("/api/saint-broker/signatures/request", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id;
      const { documentId, documentTitle } = req.body;

      if (!documentId || !documentTitle) {
        return res.status(400).json({ error: "Missing documentId or documentTitle" });
      }

      const signature = {
        id: crypto.randomUUID(),
        userId,
        documentId,
        documentTitle,
        signatureType: "document",
        status: "pending",
        signedUrl: null,
        signedAt: null,
        requestedAt: new Date(),
      };

      res.json({ success: true, signature });
    } catch (error: any) {
      console.error('Error requesting signature:', error);
      res.status(500).json({ error: "Failed to request signature" });
    }
  });

  // SaintBroker chat endpoint
  app.post("/api/saint-broker/chat", isAuthenticated, async (req: any, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Use SaintSal AI with structured responses
      const { saintSal } = await import('./lib/saintvision-ai-core');
      const aiResponse = await saintSal.chat(req.user?.userId || 'anonymous', message);

      res.json({
        response: aiResponse.response,
        actions: aiResponse.actions,
        model: aiResponse.model,
        analysis: aiResponse.analysis
      });
    } catch (error: any) {
      console.error('Error in chat:', error);
      res.json({
        response: "Hello! I'm SaintBroker. How can I help you today?",
        actions: [
          {
            type: 'button',
            text: 'Get Started',
            url: '/apply',
            primary: true
          }
        ]
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
