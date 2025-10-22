import type { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { userNavigation, pageMetadata } from '../../shared/schema';

declare global {
  namespace Express {
    interface Request {
      navigationStart?: number;
      visitedPath?: string;
    }
  }
}

/**
 * Middleware to track user navigation and page visits
 * Captures page views, time on page, referrer, and device info
 */
export function navigationTracking(req: Request, res: Response, next: NextFunction) {
  // Only track authenticated users
  if (!req.user?.userId) {
    return next();
  }

  // Capture navigation start time
  req.navigationStart = Date.now();
  req.visitedPath = req.path;

  // When response is sent, track the navigation event
  const originalSend = res.send;
  res.send = function(data: any) {
    const timeOnPage = Date.now() - (req.navigationStart || Date.now());
    
    // Don't track API calls, only page navigation
    if (!req.path.startsWith('/api/')) {
      trackNavigation({
        userId: req.user!.userId,
        path: req.visitedPath || '/',
        referrer: req.get('referer'),
        userAgent: req.get('user-agent'),
        ipAddress: req.ip || 'unknown',
        timeOnPageMs: timeOnPage,
        deviceType: detectDeviceType(req.get('user-agent') || ''),
      });
    }

    return originalSend.call(this, data);
  };

  next();
}

/**
 * Track navigation event in database
 */
async function trackNavigation(navData: {
  userId: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  timeOnPageMs: number;
  deviceType: string;
}) {
  try {
    // Get page metadata if exists
    const page = await db
      .select({ id: pageMetadata.id })
      .from(pageMetadata)
      .where((t) => t.path === navData.path)
      .limit(1);

    const pageId = page.length > 0 ? page[0].id : undefined;

    // Insert navigation record
    await db.insert(userNavigation).values({
      userId: navData.userId,
      path: navData.path,
      pageId,
      referrerPath: navData.referrer,
      deviceType: navData.deviceType,
      userAgent: navData.userAgent,
      ipAddress: navData.ipAddress,
      timeOnPageMs: navData.timeOnPageMs,
    });
  } catch (error) {
    console.error('[Navigation Tracking] Error:', error);
    // Don't fail the request if tracking fails
  }
}

/**
 * Detect device type from user agent
 */
function detectDeviceType(userAgent: string): string {
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'mobile';
  } else if (/tablet|ipad|android|kindle/i.test(userAgent)) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Get user navigation history
 */
export async function getUserNavigationHistory(
  userId: string,
  limit: number = 50
) {
  try {
    return await db
      .select({
        id: userNavigation.id,
        path: userNavigation.path,
        title: pageMetadata.title,
        category: pageMetadata.category,
        deviceType: userNavigation.deviceType,
        timeOnPageMs: userNavigation.timeOnPageMs,
        visitedAt: userNavigation.visitedAt,
      })
      .from(userNavigation)
      .leftJoin(pageMetadata, (t) => t.pageId === pageMetadata.id)
      .where((t) => t.userId === userId)
      .orderBy((t) => t.visitedAt)
      .limit(limit);
  } catch (error) {
    console.error('[Get Navigation History] Error:', error);
    return [];
  }
}

/**
 * Get user navigation statistics
 */
export async function getUserNavigationStats(userId: string) {
  try {
    const history = await getUserNavigationHistory(userId, 500);
    
    const stats = {
      totalPageViews: history.length,
      uniquePages: new Set(history.map((h) => h.path)).size,
      averageTimeOnPageMs: history.reduce((acc, h) => acc + (h.timeOnPageMs || 0), 0) / history.length,
      deviceBreakdown: {
        desktop: history.filter((h) => h.deviceType === 'desktop').length,
        mobile: history.filter((h) => h.deviceType === 'mobile').length,
        tablet: history.filter((h) => h.deviceType === 'tablet').length,
      },
      categoryBreakdown: history.reduce(
        (acc, h) => {
          if (h.category) {
            acc[h.category] = (acc[h.category] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>
      ),
      mostVisitedPages: history
        .reduce(
          (acc, h) => {
            const existing = acc.find((p) => p.path === h.path);
            if (existing) existing.count++;
            else acc.push({ path: h.path, title: h.title, count: 1 });
            return acc;
          },
          [] as Array<{ path: string; title?: string; count: number }>
        )
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    };

    return stats;
  } catch (error) {
    console.error('[Get Navigation Stats] Error:', error);
    return null;
  }
}
