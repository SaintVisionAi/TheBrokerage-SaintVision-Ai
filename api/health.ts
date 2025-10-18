// Health check endpoint for monitoring services
import { Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: Request, res: Response) {
  const startTime = Date.now();
  const checks: any = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    environment: process.env.NODE_ENV || 'production',
    services: {}
  };

  try {
    // Check database connection
    try {
      await sql`SELECT 1`;
      checks.services.database = {
        status: 'healthy',
        responseTime: Date.now() - startTime
      };
    } catch (dbError: any) {
      checks.services.database = {
        status: 'down',
        error: dbError.message
      };
      checks.status = 'degraded';
    }

    // Check OpenAI API
    if (process.env.OPENAI_API_KEY) {
      checks.services.openai = {
        status: 'configured',
        keyPresent: true
      };
    } else {
      checks.services.openai = {
        status: 'not_configured',
        keyPresent: false
      };
      checks.status = 'degraded';
    }

    // Check GHL integration
    if (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) {
      checks.services.ghl = {
        status: 'configured',
        locationId: process.env.GHL_LOCATION_ID
      };
    } else {
      checks.services.ghl = {
        status: 'not_configured'
      };
    }

    // Check Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      checks.services.twilio = {
        status: 'configured',
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
      };
    } else {
      checks.services.twilio = {
        status: 'not_configured'
      };
    }

    // Overall response time
    checks.responseTime = Date.now() - startTime;

    // Set appropriate status code
    const statusCode = checks.status === 'healthy' ? 200 : 
                       checks.status === 'degraded' ? 200 : 503;

    return res.status(statusCode).json(checks);

  } catch (error: any) {
    console.error('[HEALTH CHECK] Critical error:', error);
    return res.status(503).json({
      timestamp: new Date().toISOString(),
      status: 'down',
      error: error.message,
      responseTime: Date.now() - startTime
    });
  }
}