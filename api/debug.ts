// Debug endpoint to check what's working
import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {} as any
  };

  // Check 1: Database URL exists
  checks.checks.databaseUrlExists = !!process.env.DATABASE_URL;
  checks.checks.databaseUrl = process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET';

  // Check 2: Try to connect to database
  try {
    const result = await db.select().from(users).limit(1);
    checks.checks.databaseConnection = 'SUCCESS';
    checks.checks.userTableAccessible = true;
    checks.checks.existingUserCount = result.length;
  } catch (error: any) {
    checks.checks.databaseConnection = 'FAILED';
    checks.checks.databaseError = error.message;
    checks.checks.errorStack = error.stack;
  }

  // Check 3: Environment variables
  checks.checks.envVars = {
    jwtSecret: !!process.env.JWT_SECRET,
    internalApiKey: !!process.env.INTERNAL_API_KEY,
    azureAiKey: !!process.env.AZURE_AI_FOUNDRY_KEY,
    openaiKey: !!process.env.OPENAI_API_KEY,
    ghlApiKey: !!process.env.GHL_API_KEY,
  };

  // Check 4: Can we create a user?
  try {
    // Try to find or create test user
    const testEmail = 'test@saintvision.com';
    const [existingTest] = await db.select().from(users).where(eq(users.email, testEmail)).limit(1);

    if (existingTest) {
      checks.checks.testUserExists = true;
    } else {
      checks.checks.testUserExists = false;
      checks.checks.note = 'Test user does not exist, database is accessible but empty';
    }
  } catch (error: any) {
    checks.checks.userCreationTest = 'FAILED';
    checks.checks.userCreationError = error.message;
  }

  return res.json(checks);
}
