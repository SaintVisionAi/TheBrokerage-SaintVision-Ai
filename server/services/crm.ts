export interface CRMContact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  tags: string[];
  customFields: Record<string, any>;
}

export interface CRMSyncResult {
  success: boolean;
  contactId?: string;
  error?: string;
}

class GoHighLevelService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GOHIGHLEVEL_API_KEY || "";
    this.baseUrl = "https://rest.gohighlevel.com/v1";
  }

  async createOrUpdateContact(userData: {
    email: string;
    username: string;
    plan: string;
  }): Promise<CRMSyncResult> {
    if (!this.apiKey) {
      console.warn("GoHighLevel API key not configured");
      return { success: false, error: "API key not configured" };
    }

    try {
      const contactData = {
        email: userData.email,
        firstName: userData.username,
        tags: [`saintsal-${userData.plan}`],
        customFields: {
          saintsal_plan: userData.plan,
          saintsal_user_id: userData.username,
          source: "SaintSal Platform"
        }
      };

      const response = await fetch(`${this.baseUrl}/contacts`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        contactId: result.contact?.id || result.id
      };
    } catch (error) {
      console.error("CRM sync failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  async updateContactActivity(contactId: string, activity: {
    type: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<boolean> {
    if (!this.apiKey || !contactId) return false;

    try {
      const response = await fetch(`${this.baseUrl}/contacts/${contactId}/notes`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          body: `[SaintSal] ${activity.type}: ${activity.description}`,
          metadata: activity.metadata
        })
      });

      return response.ok;
    } catch (error) {
      console.error("Failed to update contact activity:", error);
      return false;
    }
  }

  async getContact(contactId: string): Promise<CRMContact | null> {
    if (!this.apiKey || !contactId) return null;

    try {
      const response = await fetch(`${this.baseUrl}/contacts/${contactId}`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.contact || data;
    } catch (error) {
      console.error("Failed to get contact:", error);
      return null;
    }
  }
}

export const crmService = new GoHighLevelService();
