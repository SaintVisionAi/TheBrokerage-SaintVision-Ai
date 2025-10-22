import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { routeValidation } from '../../shared/schema';
import { cache } from './cache';

/**
 * Middleware to validate routes and check user permissions
 */
export async function validateRoute(req: Request, res: Response, next: NextFunction) {
  try {
    // Build the route key (path + method)
    const routeKey = `${req.method} ${req.path}`;
    
    // Check cache first
    const cached = cache.get(routeKey);
    if (cached) {
      return handleRouteValidation(req, res, next, cached);
    }

    // Get route from database
    const route = await db
      .select()
      .from(routeValidation)
      .where((t) => t.path === req.path && t.method === req.method)
      .limit(1);

    if (route.length === 0) {
      // Route not found in database - create a default entry
      const newRoute = {
        path: req.path,
        method: req.method,
        description: `Auto-discovered ${req.method} ${req.path}`,
        requiresAuth: false,
        isActive: true,
      };

      try {
        await db.insert(routeValidation).values(newRoute);
      } catch (insertError) {
        // Route might have been inserted by another request, continue
      }

      return next();
    }

    // Cache the route (5 minutes)
    cache.set(routeKey, route[0], 5 * 60 * 1000);

    // Handle validation
    return handleRouteValidation(req, res, next, route[0]);
  } catch (error) {
    console.error('[Route Validation] Error:', error);
    // Continue even if validation fails
    return next();
  }
}

/**
 * Handle route validation logic
 */
function handleRouteValidation(
  req: Request,
  res: Response,
  next: NextFunction,
  route: any
) {
  // Check if route is active
  if (!route.isActive) {
    return res.status(410).json({ 
      message: 'This route is no longer available',
      path: route.path 
    });
  }

  // Check authentication requirement
  if (route.requiresAuth && !req.user) {
    return res.status(401).json({ 
      message: 'Authentication required for this route',
      path: route.path 
    });
  }

  // Check role requirements
  if (route.allowedRoles && route.allowedRoles.length > 0) {
    if (!req.user || !route.allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions for this route',
        path: route.path,
        requiredRoles: route.allowedRoles,
        userRole: req.user?.role || 'guest'
      });
    }
  }

  // Check rate limiting
  if (route.rateLimitPerMinute) {
    const rateLimitKey = `rate-limit:${req.user?.userId || req.ip}:${route.path}`;
    const currentCount = cache.get(rateLimitKey) || 0;

    if (currentCount >= route.rateLimitPerMinute) {
      return res.status(429).json({ 
        message: 'Rate limit exceeded',
        path: route.path,
        resetAt: new Date(Date.now() + 60000)
      });
    }

    // Increment counter (expires after 1 minute)
    cache.set(rateLimitKey, currentCount + 1, 60 * 1000);
  }

  return next();
}

/**
 * Get all valid routes
 */
export async function getAllRoutes() {
  try {
    return await db
      .select()
      .from(routeValidation)
      .where((t) => t.isActive === true)
      .orderBy((t) => t.path);
  } catch (error) {
    console.error('[Get All Routes] Error:', error);
    return [];
  }
}

/**
 * Validate a specific route exists and user has permission
 */
export async function checkRoutePermission(
  path: string,
  method: string,
  userRole?: string
) {
  try {
    const route = await db
      .select()
      .from(routeValidation)
      .where((t) => t.path === path && t.method === method)
      .limit(1);

    if (route.length === 0) {
      return { valid: false, reason: 'Route not found' };
    }

    const routeData = route[0];

    if (!routeData.isActive) {
      return { valid: false, reason: 'Route is inactive' };
    }

    if (routeData.requiresAuth && !userRole) {
      return { valid: false, reason: 'Authentication required' };
    }

    if (routeData.allowedRoles && routeData.allowedRoles.length > 0) {
      if (!userRole || !routeData.allowedRoles.includes(userRole)) {
        return { 
          valid: false, 
          reason: 'Insufficient permissions',
          requiredRoles: routeData.allowedRoles 
        };
      }
    }

    return { valid: true, route: routeData };
  } catch (error) {
    console.error('[Check Route Permission] Error:', error);
    return { valid: false, reason: 'Error checking route' };
  }
}

/**
 * Register new routes in the validation system
 */
export async function registerRoutes(routes: Array<{
  path: string;
  method: string;
  description?: string;
  requiresAuth?: boolean;
  allowedRoles?: string[];
  rateLimitPerMinute?: number;
}>) {
  try {
    for (const route of routes) {
      // Check if route already exists
      const existing = await db
        .select()
        .from(routeValidation)
        .where((t) => t.path === route.path && t.method === route.method)
        .limit(1);

      if (existing.length === 0) {
        await db.insert(routeValidation).values({
          ...route,
          isActive: true,
        });
      }
    }

    // Clear cache after registering new routes
    cache.clear();
    return { success: true, routesRegistered: routes.length };
  } catch (error) {
    console.error('[Register Routes] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
