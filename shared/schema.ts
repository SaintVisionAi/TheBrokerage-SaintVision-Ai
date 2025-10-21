import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (REQUIRED for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - supports both Replit Auth (OAuth) and legacy username/password
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }),
  company: varchar("company", { length: 255 }),
  username: varchar("username", { length: 255 }).unique(),
  password: text("password"),
  emailVerified: boolean("email_verified"),
  verificationToken: text("verification_token"),
  verificationTokenExpires: timestamp("verification_token_expires"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  role: text("role").notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // tone, processing time, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const knowledgeBase = pgTable("knowledge_base", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  filename: text("filename").notNull(),
  content: text("content").notNull(),
  embeddings: jsonb("embeddings"),
  processedAt: timestamp("processed_at").defaultNow(),
});

export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clientNotes = pgTable("client_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  contactId: varchar("contact_id").references(() => contacts.id),
  opportunityId: varchar("opportunity_id").references(() => opportunities.id),
  uploadTokenId: varchar("upload_token_id").references(() => uploadTokens.id),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  fileUrl: text("file_url").notNull(),
  division: varchar("division", { length: 50 }),
  documentType: varchar("document_type", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
  verificationDetails: jsonb("verification_details"),
  processedContent: text("processed_content"),
  summary: text("summary"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const signatures = pgTable("signatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  documentId: varchar("document_id").references(() => documents.id),
  documentTitle: text("document_title").notNull(),
  signatureType: text("signature_type").notNull(), // 'e-sign', 'docusign', 'manual'
  status: text("status").notNull().default("pending"), // 'pending', 'signed', 'declined'
  signedUrl: text("signed_url"),
  signedAt: timestamp("signed_at"),
  requestedAt: timestamp("requested_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  title: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  role: true,
  content: true,
  metadata: true,
});

export const insertKnowledgeSchema = createInsertSchema(knowledgeBase).pick({
  userId: true,
  filename: true,
  content: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).pick({
  userId: true,
  action: true,
  details: true,
});

export const insertClientNoteSchema = createInsertSchema(clientNotes).pick({
  userId: true,
  conversationId: true,
  title: true,
  content: true,
  tags: true,
  isPinned: true,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  userId: true,
  contactId: true,
  opportunityId: true,
  uploadTokenId: true,
  conversationId: true,
  filename: true,
  fileType: true,
  fileSize: true,
  fileUrl: true,
  division: true,
  documentType: true,
  status: true,
  verificationDetails: true,
  processedContent: true,
  summary: true,
});

export const insertSignatureSchema = createInsertSchema(signatures).pick({
  userId: true,
  documentId: true,
  documentTitle: true,
  signatureType: true,
  status: true,
  signedUrl: true,
});

// GHL Contacts (synced from GoHighLevel)
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ghlContactId: varchar("ghl_contact_id").unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 50 }),
  source: varchar("source", { length: 255 }),
  tags: text("tags").array(),
  customFields: jsonb("custom_fields"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// GHL Opportunities (synced from GoHighLevel)
export const opportunities = pgTable("opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ghlOpportunityId: varchar("ghl_opportunity_id").unique(),
  contactId: varchar("contact_id").references(() => contacts.id),  // Link to internal contact ID
  ghlContactId: varchar("ghl_contact_id").references(() => contacts.ghlContactId),
  pipelineId: varchar("pipeline_id", { length: 255 }),
  stageId: varchar("stage_id", { length: 255 }),
  stageName: varchar("stage_name", { length: 255 }),
  name: varchar("name", { length: 500 }),
  monetaryValue: integer("monetary_value"),
  division: varchar("division", { length: 50 }), // investment, real_estate, lending
  priority: varchar("priority", { length: 50 }), // hot, warm, cold
  status: varchar("status", { length: 50 }),
  firstName: varchar("first_name", { length: 255 }),  // Denormalized for display
  lastName: varchar("last_name", { length: 255 }),    // Denormalized for display
  email: varchar("email", { length: 255 }),           // Denormalized for display
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Classifications for leads
export const aiClassifications = pgTable("ai_classifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").references(() => contacts.id),
  opportunityId: varchar("opportunity_id").references(() => opportunities.id),
  division: varchar("division", { length: 50 }),
  priority: varchar("priority", { length: 50 }),
  estimatedValue: integer("estimated_value"),
  reasoning: text("reasoning"),
  nextSteps: text("next_steps").array(),
  confidenceScore: integer("confidence_score"), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
});

// Document upload tokens
export const uploadTokens = pgTable("upload_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  token: varchar("token", { length: 255 }).unique().notNull(),
  contactId: varchar("contact_id").references(() => contacts.id),
  opportunityId: varchar("opportunity_id").references(() => opportunities.id),
  division: varchar("division", { length: 50 }),
  requiredDocuments: text("required_documents").array(),
  uploadedDocuments: text("uploaded_documents").array().default(sql`ARRAY[]::text[]`),
  expiresAt: timestamp("expires_at"),
  used: boolean("used").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Automation execution logs
export const automationLogs = pgTable("automation_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").references(() => contacts.id),
  opportunityId: varchar("opportunity_id").references(() => opportunities.id),
  actionType: varchar("action_type", { length: 255 }),
  actionDetails: jsonb("action_details"),
  success: boolean("success"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// SMS messages tracking
export const smsMessages = pgTable("sms_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").references(() => contacts.id),
  direction: varchar("direction", { length: 50 }), // 'inbound' or 'outbound'
  fromNumber: varchar("from_number", { length: 50 }),
  toNumber: varchar("to_number", { length: 50 }),
  message: text("message"),
  status: varchar("status", { length: 50 }),
  ghlMessageId: varchar("ghl_message_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat messages for SaintBroker AI
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contactId: varchar("contact_id").references(() => contacts.id),
  message: text("message"),
  role: varchar("role", { length: 50 }), // 'user' or 'assistant'
  intent: varchar("intent", { length: 255 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Loan Products table - stores details for each loan type
export const loanProducts = pgTable("loan_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // MCA, Term Loan, Equipment, Real Estate, SBA
  minAmount: integer("min_amount").notNull(),
  maxAmount: integer("max_amount").notNull(),
  minRate: varchar("min_rate", { length: 20 }), // "9.99%" or "Factor 1.15"
  maxRate: varchar("max_rate", { length: 20 }), // "29.99%" or "Factor 1.45"
  terms: varchar("terms", { length: 100 }), // "3-24 months", "5-30 years"
  minCredit: integer("min_credit"),
  speedDays: integer("speed_days"), // How fast funding happens
  requirements: jsonb("requirements"), // Array of requirements
  features: jsonb("features"), // Array of features/benefits
  disclosures: text("disclosures"), // Legal disclosures
  description: text("description"),
  priority: integer("priority").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Application Signatures table - stores e-signatures and consent
export const applicationSignatures = pgTable("application_signatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(), // Links to application/opportunity
  signatureData: text("signature_data").notNull(), // Base64 signature image or DocuSign envelope ID
  signatureType: varchar("signature_type", { length: 50 }).notNull(), // 'drawn', 'typed', 'docusign'
  fullName: varchar("full_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 100 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  consentText: text("consent_text").notNull(), // What they agreed to
  consentGiven: boolean("consent_given").default(true),
  documentUrl: text("document_url"), // Link to signed document
  signedAt: timestamp("signed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Application Documents table - stores uploaded documents for applications
export const applicationDocuments = pgTable("application_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  documentType: varchar("document_type", { length: 100 }).notNull(), // bank_statement, tax_return, etc.
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for new tables
export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiClassificationSchema = createInsertSchema(aiClassifications).omit({
  id: true,
  createdAt: true,
});

export const insertUploadTokenSchema = createInsertSchema(uploadTokens).omit({
  id: true,
  createdAt: true,
});

export const insertAutomationLogSchema = createInsertSchema(automationLogs).omit({
  id: true,
  createdAt: true,
});

export const insertSmsMessageSchema = createInsertSchema(smsMessages).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertLoanProductSchema = createInsertSchema(loanProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationSignatureSchema = createInsertSchema(applicationSignatures).omit({
  id: true,
  createdAt: true,
  signedAt: true,
});

export const insertApplicationDocumentSchema = createInsertSchema(applicationDocuments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertKnowledge = z.infer<typeof insertKnowledgeSchema>;
export type Knowledge = typeof knowledgeBase.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertClientNote = z.infer<typeof insertClientNoteSchema>;
export type ClientNote = typeof clientNotes.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertSignature = z.infer<typeof insertSignatureSchema>;
export type Signature = typeof signatures.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunities.$inferSelect;
export type InsertAiClassification = z.infer<typeof insertAiClassificationSchema>;
export type AiClassification = typeof aiClassifications.$inferSelect;
export type InsertUploadToken = z.infer<typeof insertUploadTokenSchema>;
export type UploadToken = typeof uploadTokens.$inferSelect;
export type InsertAutomationLog = z.infer<typeof insertAutomationLogSchema>;
export type AutomationLog = typeof automationLogs.$inferSelect;
export type InsertSmsMessage = z.infer<typeof insertSmsMessageSchema>;
export type SmsMessage = typeof smsMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertLoanProduct = z.infer<typeof insertLoanProductSchema>;
export type LoanProduct = typeof loanProducts.$inferSelect;
export type InsertApplicationSignature = z.infer<typeof insertApplicationSignatureSchema>;
export type ApplicationSignature = typeof applicationSignatures.$inferSelect;
export type InsertApplicationDocument = z.infer<typeof insertApplicationDocumentSchema>;
export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
