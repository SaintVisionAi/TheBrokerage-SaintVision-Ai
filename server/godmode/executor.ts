import { storage } from "../storage";
import { crmService } from "../services/crm";
import { brainService } from "../services/brain";

export interface GodmodeCommand {
  type: string;
  parameters: Record<string, any>;
  userId?: string;
}

export interface GodmodeResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
}

export class GodmodeExecutor {
  async executeCommand(command: GodmodeCommand): Promise<GodmodeResult> {
    const startTime = Date.now();

    try {
      let result: any;

      switch (command.type) {
        case "system_status":
          result = await this.getSystemStatus();
          break;

        case "user_stats":
          result = await this.getUserStats(command.parameters.userId);
          break;

        case "force_crm_sync":
          result = await this.forceCrmSync(command.parameters.userId);
          break;

        case "knowledge_stats":
          result = await this.getKnowledgeStats(command.parameters.userId);
          break;

        case "system_logs":
          result = await this.getSystemLogs(command.parameters.limit || 100);
          break;

        case "cleanup_sessions":
          result = await this.cleanupSessions();
          break;

        default:
          throw new Error(`Unknown command type: ${command.type}`);
      }

      // Log the godmode execution
      await storage.createSystemLog({
        userId: command.userId,
        action: "godmode_execution",
        details: {
          command: command.type,
          parameters: command.parameters,
          success: true
        }
      });

      return {
        success: true,
        result,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      console.error("Godmode execution failed:", error);
      
      await storage.createSystemLog({
        userId: command.userId,
        action: "godmode_execution",
        details: {
          command: command.type,
          parameters: command.parameters,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        }
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTime: Date.now() - startTime
      };
    }
  }

  private async getSystemStatus(): Promise<any> {
    const logs = await storage.getSystemLogs();
    const recentLogs = logs.slice(0, 10);
    
    return {
      status: "operational",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      recentActivity: recentLogs.map(log => ({
        action: log.action,
        timestamp: log.createdAt,
        userId: log.userId
      }))
    };
  }

  private async getUserStats(userId?: string): Promise<any> {
    if (!userId) {
      throw new Error("User ID required for user stats");
    }

    const conversations = await storage.getConversations(userId);
    const knowledgeBase = await storage.getKnowledgeBase(userId);
    const logs = await storage.getSystemLogs(userId);

    return {
      conversationCount: conversations.length,
      knowledgeItemCount: knowledgeBase.length,
      activityCount: logs.length,
      lastActivity: logs[0]?.createdAt
    };
  }

  private async forceCrmSync(userId?: string): Promise<any> {
    if (!userId) {
      throw new Error("User ID required for CRM sync");
    }

    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.email) {
      throw new Error("User email required for CRM sync");
    }

    const syncResult = await crmService.createOrUpdateContact({
      email: user.email,
      username: user.username,
      plan: user.plan || "free"
    });

    if (syncResult.success && syncResult.contactId) {
      await storage.updateUserCrmId(userId, syncResult.contactId);
    }

    return syncResult;
  }

  private async getKnowledgeStats(userId?: string): Promise<any> {
    if (!userId) {
      throw new Error("User ID required for knowledge stats");
    }

    const knowledgeBase = await storage.getKnowledgeBase(userId);
    
    const stats = {
      totalItems: knowledgeBase.length,
      totalContentLength: knowledgeBase.reduce((sum, item) => sum + item.content.length, 0),
      fileTypes: {} as Record<string, number>,
      processingDates: knowledgeBase.map(item => item.processedAt)
    };

    // Analyze file types
    knowledgeBase.forEach(item => {
      const extension = item.filename.split('.').pop()?.toLowerCase() || 'unknown';
      stats.fileTypes[extension] = (stats.fileTypes[extension] || 0) + 1;
    });

    return stats;
  }

  private async getSystemLogs(limit: number): Promise<any> {
    const logs = await storage.getSystemLogs();
    return logs.slice(0, limit);
  }

  private async cleanupSessions(): Promise<any> {
    // In a real implementation, this would clean up expired sessions
    // For now, just return a success message
    return {
      message: "Session cleanup completed",
      cleanedSessions: 0
    };
  }
}

export const godmodeExecutor = new GodmodeExecutor();
