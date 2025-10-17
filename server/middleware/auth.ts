import type { Request, Response, NextFunction } from 'express';
import { verifySession, type SessionData } from '../lib/session';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: SessionData;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.session;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Please log in' });
  }

  const sessionData = verifySession(token);

  if (!sessionData) {
    return res.status(401).json({ message: 'Unauthorized - Invalid or expired session' });
  }

  // Attach user data to request
  req.user = sessionData;
  next();
}

/**
 * Middleware to check if user has required role(s)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden - Insufficient permissions',
        requiredRole: allowedRoles,
        userRole: req.user.role 
      });
    }

    next();
  };
}

/**
 * Middleware for admin-only routes
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'broker') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
}
