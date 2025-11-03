import { eq } from 'drizzle-orm';
import { applications } from '../db/schema';

async getApplicationById(applicationId: string) {
  const result = await this.db.select().from(applications).where(eq(applications.applicationId, applicationId)).limit(1);
  return result[0] || null;
}

async getApplicationByGHLOpportunityId(opportunityId: string) {
  const result = await this.db.select().from(applications).where(eq(applications.ghlOpportunityId, opportunityId)).limit(1);
  return result[0] || null;
}

async updateApplicationById(applicationId: string, updates: any) {
  const result = await this.db.update(applications).set({ ...updates, updatedAt: new Date() }).where(eq(applications.applicationId, applicationId)).returning();
  return result[0] || null;
}
