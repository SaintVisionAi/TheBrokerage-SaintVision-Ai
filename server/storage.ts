import { 
  type User, 
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Knowledge,
  type InsertKnowledge,
  type SystemLog,
  type InsertSystemLog,
  type ClientNote,
  type InsertClientNote,
  type Document,
  type InsertDocument,
  type Signature,
  type InsertSignature,
  type LoanProduct,
  type InsertLoanProduct,
  type ApplicationSignature,
  type InsertApplicationSignature,
  type ApplicationDocument,
  type InsertApplicationDocument,
  users,
  conversations,
  messages,
  knowledgeBase,
  systemLogs,
  clientNotes,
  documents,
  signatures,
  loanProducts,
  applicationSignatures,
  applicationDocuments
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCrmId(userId: string, crmContactId: string): Promise<User>;
  
  // Conversation operations
  getConversations(userId: string): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Message operations
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Knowledge base operations
  getKnowledgeBase(userId: string): Promise<Knowledge[]>;
  createKnowledge(knowledge: InsertKnowledge): Promise<Knowledge>;
  searchKnowledge(userId: string, query: string): Promise<Knowledge[]>;
  
  // System logs
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getSystemLogs(userId?: string): Promise<SystemLog[]>;

  // Client notes operations
  getClientNotes(userId: string): Promise<ClientNote[]>;
  createClientNote(note: InsertClientNote): Promise<ClientNote>;
  updateClientNote(id: string, updates: Partial<InsertClientNote>): Promise<ClientNote>;
  deleteClientNote(id: string): Promise<void>;

  // Documents operations
  getUserDocuments(userId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<void>;

  // Signatures operations
  getUserSignatures(userId: string): Promise<Signature[]>;
  createSignature(sig: InsertSignature): Promise<Signature>;
  updateSignature(id: string, updates: Partial<InsertSignature>): Promise<Signature>;

  // Loan Products operations
  getLoanProducts(): Promise<LoanProduct[]>;
  getLoanProductsByCategory(category: string): Promise<LoanProduct[]>;
  createLoanProduct(product: InsertLoanProduct): Promise<LoanProduct>;
  
  // Application Signatures operations
  getApplicationSignature(applicationId: string): Promise<ApplicationSignature | undefined>;
  createApplicationSignature(sig: InsertApplicationSignature): Promise<ApplicationSignature>;
  
  // Application Documents operations
  getApplicationDocuments(applicationId: string): Promise<ApplicationDocument[]>;
  createApplicationDocument(doc: InsertApplicationDocument): Promise<ApplicationDocument>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserCrmId(userId: string, crmContactId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ crmContactId })
      .where(eq(users.id, userId))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId));
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getKnowledgeBase(userId: string): Promise<Knowledge[]> {
    return await db
      .select()
      .from(knowledgeBase)
      .where(eq(knowledgeBase.userId, userId));
  }

  async createKnowledge(insertKnowledge: InsertKnowledge): Promise<Knowledge> {
    const [knowledge] = await db
      .insert(knowledgeBase)
      .values(insertKnowledge)
      .returning();
    return knowledge;
  }

  async searchKnowledge(userId: string, query: string): Promise<Knowledge[]> {
    return await db
      .select()
      .from(knowledgeBase)
      .where(eq(knowledgeBase.userId, userId));
    // TODO: Implement proper full-text search with embeddings
  }

  async createSystemLog(insertLog: InsertSystemLog): Promise<SystemLog> {
    const [log] = await db
      .insert(systemLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getSystemLogs(userId?: string): Promise<SystemLog[]> {
    if (userId) {
      return await db
        .select()
        .from(systemLogs)
        .where(eq(systemLogs.userId, userId));
    }
    return await db.select().from(systemLogs);
  }

  // Client notes operations
  async getClientNotes(userId: string): Promise<ClientNote[]> {
    return await db
      .select()
      .from(clientNotes)
      .where(eq(clientNotes.userId, userId));
  }

  async createClientNote(insertNote: InsertClientNote): Promise<ClientNote> {
    const [note] = await db
      .insert(clientNotes)
      .values(insertNote)
      .returning();
    return note;
  }

  async updateClientNote(id: string, updates: Partial<InsertClientNote>): Promise<ClientNote> {
    const [note] = await db
      .update(clientNotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(clientNotes.id, id))
      .returning();
    if (!note) throw new Error("Note not found");
    return note;
  }

  async deleteClientNote(id: string): Promise<void> {
    await db.delete(clientNotes).where(eq(clientNotes.id, id));
  }

  // Documents operations
  async getUserDocuments(userId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId));
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const [doc] = await db
      .insert(documents)
      .values(insertDoc)
      .returning();
    return doc;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
    return doc || undefined;
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Signatures operations
  async getUserSignatures(userId: string): Promise<Signature[]> {
    return await db
      .select()
      .from(signatures)
      .where(eq(signatures.userId, userId));
  }

  async createSignature(insertSig: InsertSignature): Promise<Signature> {
    const [sig] = await db
      .insert(signatures)
      .values(insertSig)
      .returning();
    return sig;
  }

  async updateSignature(id: string, updates: Partial<InsertSignature>): Promise<Signature> {
    const [sig] = await db
      .update(signatures)
      .set(updates)
      .where(eq(signatures.id, id))
      .returning();
    if (!sig) throw new Error("Signature not found");
    return sig;
  }
}

export const storage = new DatabaseStorage();
