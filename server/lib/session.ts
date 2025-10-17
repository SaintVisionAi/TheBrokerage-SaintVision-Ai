import type { Response } from 'express';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for security');
}
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

export interface SessionData {
  userId: string;
  email: string;
  role: string;
  username?: string;
}

/**
 * Create a JWT session token and set it as an HTTP-only cookie
 */
export function createSession(res: Response, sessionData: SessionData): string {
  const token = jwt.sign(sessionData, JWT_SECRET, {
    expiresIn: '7d',
  });

  // Set HTTP-only cookie
  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION * 1000, // Convert to milliseconds
    path: '/',
  });

  return token;
}

/**
 * Verify and decode a JWT session token
 */
export function verifySession(token: string): SessionData | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Delete the session cookie
 */
export function deleteSession(res: Response): void {
  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}
