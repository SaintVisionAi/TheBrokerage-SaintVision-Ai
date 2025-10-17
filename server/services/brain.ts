import { storage } from "../storage";
import { processKnowledgeContent } from "./openai";
import type { Knowledge } from "@shared/schema";

export interface BrainIngestionResult {
  success: boolean;
  knowledgeId?: string;
  error?: string;
  processingTime: number;
}

export interface KnowledgeSearchResult {
  content: string;
  filename: string;
  relevanceScore: number;
}

export class BrainService {
  async ingestFile(
    userId: string,
    filename: string,
    content: string
  ): Promise<BrainIngestionResult> {
    const startTime = Date.now();

    try {
      // Validate file size (limit to 10MB for now)
      if (content.length > 10 * 1024 * 1024) {
        return {
          success: false,
          error: "File too large. Maximum size is 10MB.",
          processingTime: Date.now() - startTime
        };
      }

      // Process content with OpenAI
      const processedChunks = await processKnowledgeContent(content, filename);
      
      // Store in knowledge base
      const knowledge = await storage.createKnowledge({
        userId,
        filename,
        content: processedChunks.join("\n\n")
      });

      // Log the ingestion
      await storage.createSystemLog({
        userId,
        action: "brain_ingestion",
        details: {
          filename,
          contentLength: content.length,
          chunksGenerated: processedChunks.length
        }
      });

      return {
        success: true,
        knowledgeId: knowledge.id,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error("Brain ingestion failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        processingTime: Date.now() - startTime
      };
    }
  }

  async searchKnowledge(
    userId: string,
    query: string,
    limit: number = 5
  ): Promise<KnowledgeSearchResult[]> {
    try {
      const knowledgeItems = await storage.searchKnowledge(userId, query);
      
      // Simple relevance scoring based on keyword matches
      const results: KnowledgeSearchResult[] = knowledgeItems.map(item => ({
        content: item.content,
        filename: item.filename,
        relevanceScore: this.calculateRelevanceScore(item.content, query)
      }));

      // Sort by relevance and limit results
      return results
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    } catch (error) {
      console.error("Knowledge search failed:", error);
      return [];
    }
  }

  async getKnowledgeBase(userId: string): Promise<Knowledge[]> {
    return await storage.getKnowledgeBase(userId);
  }

  async deleteKnowledge(userId: string, knowledgeId: string): Promise<boolean> {
    // In a real implementation, you'd have a delete method in storage
    // For now, just log the attempt
    await storage.createSystemLog({
      userId,
      action: "knowledge_deletion_attempt",
      details: { knowledgeId }
    });
    
    return true;
  }

  private calculateRelevanceScore(content: string, query: string): number {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();
    
    let score = 0;
    for (const term of queryTerms) {
      const matches = (contentLower.match(new RegExp(term, 'g')) || []).length;
      score += matches;
    }
    
    // Normalize by content length
    return score / (content.length / 1000);
  }
}

export const brainService = new BrainService();
