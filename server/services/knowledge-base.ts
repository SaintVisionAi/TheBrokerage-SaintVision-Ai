import OpenAI from 'openai';
import { db } from '../db';
import { knowledgeBase } from '@shared/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// Knowledge Base Service for SaintBroker AI's domain expertise
export class KnowledgeBaseService {
  private openaiClient: OpenAI | null = null;
  private readonly EMBEDDING_MODEL = 'text-embedding-3-small';
  private readonly CHUNK_SIZE = 1000; // Characters per chunk
  private readonly CHUNK_OVERLAP = 200; // Overlap between chunks

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log('🧠 Knowledge Base Service initialized with OpenAI embeddings');
    } else {
      console.warn('⚠️ No OpenAI API key found - Knowledge base will operate without embeddings');
    }
  }

  // Split content into chunks for embedding
  private chunkContent(content: string): string[] {
    const chunks: string[] = [];
    let currentPosition = 0;

    while (currentPosition < content.length) {
      const endPosition = Math.min(currentPosition + this.CHUNK_SIZE, content.length);
      const chunk = content.slice(currentPosition, endPosition);
      chunks.push(chunk);
      currentPosition = endPosition - this.CHUNK_OVERLAP;
    }

    return chunks;
  }

  // Generate embeddings for text using OpenAI
  async generateEmbeddings(text: string): Promise<number[] | null> {
    if (!this.openaiClient) {
      console.warn('OpenAI client not initialized, skipping embeddings');
      return null;
    }

    try {
      const response = await this.openaiClient.embeddings.create({
        model: this.EMBEDDING_MODEL,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embeddings:', error);
      return null;
    }
  }

  // Ingest a knowledge file into the database
  async ingestKnowledgeFile(
    userId: string,
    filename: string,
    content: string
  ): Promise<{ success: boolean; chunks: number; error?: string }> {
    try {
      console.log(`📚 Ingesting knowledge file: ${filename}`);
      
      // Split content into chunks
      const chunks = this.chunkContent(content);
      console.log(`📝 Split into ${chunks.length} chunks`);

      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const chunkId = `${filename}_chunk_${i}`;

        // Generate embeddings for this chunk
        const embeddings = await this.generateEmbeddings(chunk);

        // Store in database
        await db.insert(knowledgeBase).values({
          userId,
          filename: chunkId,
          content: chunk,
          embeddings: embeddings ? { vector: embeddings } : null,
        }).onConflictDoUpdate({
          target: [knowledgeBase.filename],
          set: {
            content: chunk,
            embeddings: embeddings ? { vector: embeddings } : null,
            processedAt: new Date()
          }
        });

        console.log(`✅ Processed chunk ${i + 1}/${chunks.length} for ${filename}`);
      }

      return { success: true, chunks: chunks.length };
    } catch (error) {
      console.error('Error ingesting knowledge file:', error);
      return { 
        success: false, 
        chunks: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Load all knowledge files from the knowledge directory
  async loadAllKnowledgeFiles(userId: string): Promise<{
    loaded: number;
    failed: number;
    errors: string[];
  }> {
    const knowledgeDir = path.join(process.cwd(), 'server', 'knowledge');
    const results = { loaded: 0, failed: 0, errors: [] as string[] };

    try {
      // Check if directory exists
      if (!fs.existsSync(knowledgeDir)) {
        console.log('📁 Creating knowledge directory...');
        fs.mkdirSync(knowledgeDir, { recursive: true });
      }

      // Read all .md files from the directory
      const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
      console.log(`📂 Found ${files.length} knowledge files to process`);

      for (const file of files) {
        const filePath = path.join(knowledgeDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`\n🔄 Processing ${file} (${(content.length / 1024).toFixed(1)}KB)`);
        const result = await this.ingestKnowledgeFile(userId, file, content);
        
        if (result.success) {
          results.loaded++;
          console.log(`✅ Successfully loaded ${file} (${result.chunks} chunks)`);
        } else {
          results.failed++;
          results.errors.push(`${file}: ${result.error}`);
          console.error(`❌ Failed to load ${file}: ${result.error}`);
        }
      }

      return results;
    } catch (error) {
      console.error('Error loading knowledge files:', error);
      results.errors.push(error instanceof Error ? error.message : 'Unknown error');
      return results;
    }
  }

  // Search knowledge base using vector similarity (if embeddings available)
  async searchKnowledge(
    query: string,
    userId?: string,
    limit: number = 5
  ): Promise<{ content: string; filename: string; score?: number }[]> {
    try {
      // If we have embeddings capability, use vector search
      if (this.openaiClient) {
        const queryEmbedding = await this.generateEmbeddings(query);
        
        if (queryEmbedding) {
          // For now, we'll do a simple retrieval without vector similarity
          // (Full vector similarity would require pgvector extension)
          const results = await db
            .select()
            .from(knowledgeBase)
            .where(userId ? eq(knowledgeBase.userId, userId) : undefined)
            .limit(limit);

          return results.map(r => ({
            content: r.content,
            filename: r.filename,
            score: 1.0 // Placeholder score
          }));
        }
      }

      // Fallback to text search
      console.log('Using text-based search (no embeddings)');
      const results = await db
        .select()
        .from(knowledgeBase)
        .where(userId ? eq(knowledgeBase.userId, userId) : undefined)
        .limit(limit);

      // Simple keyword matching
      const queryLower = query.toLowerCase();
      const scored = results.map(r => {
        const contentLower = r.content.toLowerCase();
        const score = queryLower.split(' ').reduce((acc, word) => {
          return acc + (contentLower.includes(word) ? 1 : 0);
        }, 0) / queryLower.split(' ').length;

        return {
          content: r.content,
          filename: r.filename,
          score
        };
      });

      // Sort by score and return top results
      return scored
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return [];
    }
  }

  // Get all knowledge entries for a user
  async getUserKnowledge(userId: string): Promise<any[]> {
    try {
      return await db
        .select()
        .from(knowledgeBase)
        .where(eq(knowledgeBase.userId, userId));
    } catch (error) {
      console.error('Error getting user knowledge:', error);
      return [];
    }
  }

  // Clear knowledge base for a user
  async clearUserKnowledge(userId: string): Promise<boolean> {
    try {
      await db
        .delete(knowledgeBase)
        .where(eq(knowledgeBase.userId, userId));
      return true;
    } catch (error) {
      console.error('Error clearing user knowledge:', error);
      return false;
    }
  }

  // Get knowledge statistics
  async getKnowledgeStats(userId?: string): Promise<{
    totalChunks: number;
    totalFiles: number;
    withEmbeddings: number;
    lastUpdated?: Date;
  }> {
    try {
      const results = await db
        .select()
        .from(knowledgeBase)
        .where(userId ? eq(knowledgeBase.userId, userId) : undefined);

      const uniqueFiles = new Set(results.map(r => r.filename.split('_chunk_')[0]));
      const withEmbeddings = results.filter(r => r.embeddings !== null).length;
      const lastUpdated = results.reduce((latest, r) => {
        const date = r.processedAt;
        if (!date) return latest;
        return !latest || date > latest ? date : latest;
      }, null as Date | null);

      return {
        totalChunks: results.length,
        totalFiles: uniqueFiles.size,
        withEmbeddings,
        lastUpdated: lastUpdated || undefined
      };
    } catch (error) {
      console.error('Error getting knowledge stats:', error);
      return {
        totalChunks: 0,
        totalFiles: 0,
        withEmbeddings: 0
      };
    }
  }
}

// Export singleton instance
export const knowledgeBaseService = new KnowledgeBaseService();