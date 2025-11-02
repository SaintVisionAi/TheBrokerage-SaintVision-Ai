// Emergency admin creation endpoint for initial setup
import { db } from '../server/db';
import { users } from '../shared/schema';
import { hashPassword } from '../server/lib/password';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  // Only allow in development or with secret key
  const secret = req.query.secret || req.headers['x-admin-secret'];

  if (process.env.NODE_ENV === 'production' && secret !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // Check if admin already exists
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, 'ryan@cookinknowledge.com'))
      .limit(1);

    if (existingAdmin) {
      return res.json({
        success: true,
        message: 'Admin user already exists',
        email: 'ryan@cookinknowledge.com',
        note: 'Use your password to log in'
      });
    }

    // Create admin user
    const hashedPassword = await hashPassword('SaintVision2025!');

    const [newAdmin] = await db
      .insert(users)
      .values({
        username: 'admin',
        email: 'ryan@cookinknowledge.com',
        password: hashedPassword,
        role: 'admin',
        emailVerified: true,
        createdAt: new Date()
      })
      .returning();

    return res.json({
      success: true,
      message: 'Admin user created successfully!',
      credentials: {
        email: 'ryan@cookinknowledge.com',
        password: 'SaintVision2025!',
        role: 'admin'
      },
      note: 'Login at /auth with these credentials'
    });

  } catch (error: any) {
    console.error('Admin creation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
      debug: {
        databaseUrlExists: !!process.env.DATABASE_URL,
        databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
        help: 'Check Vercel environment variables are deployed. Visit /api/debug for more info.'
      }
    });
  }
}
