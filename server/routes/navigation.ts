import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../middleware/auth';
import { 
  getUserNavigationHistory, 
  getUserNavigationStats 
} from '../middleware/navigation-tracking';
import { 
  getAllRoutes, 
  checkRoutePermission,
  registerRoutes as registerRoutesUtil
} from '../middleware/route-validation';
import { db } from '../db';
import { pageMetadata } from '../../shared/schema';

const router = Router();

/**
 * GET /api/navigation/history
 * Get current user's navigation history
 */
router.get('/api/navigation/history', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const history = await getUserNavigationHistory(req.user!.userId, limit);
    
    res.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    console.error('[Navigation History] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch navigation history' 
    });
  }
});

/**
 * GET /api/navigation/stats
 * Get current user's navigation statistics
 */
router.get('/api/navigation/stats', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const stats = await getUserNavigationStats(req.user!.userId);
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('[Navigation Stats] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch navigation statistics' 
    });
  }
});

/**
 * GET /api/routes/all
 * Get all valid routes in the system
 */
router.get('/api/routes/all', isAuthenticated, async (req: Request, res: Response) => {
  try {
    // Only admins can view all routes
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }

    const routes = await getAllRoutes();
    
    res.json({
      success: true,
      data: routes,
      count: routes.length,
    });
  } catch (error) {
    console.error('[Get All Routes] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch routes' 
    });
  }
});

/**
 * POST /api/routes/check
 * Check if a specific route is valid and user has permission
 */
router.post('/api/routes/check', async (req: Request, res: Response) => {
  try {
    const { path, method = 'GET' } = req.body;

    if (!path) {
      return res.status(400).json({ 
        success: false, 
        error: 'Path is required' 
      });
    }

    const result = await checkRoutePermission(path, method, req.user?.role);
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Check Route Permission] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check route' 
    });
  }
});

/**
 * POST /api/routes/register
 * Register new routes in the validation system
 * Admin only
 */
router.post('/api/routes/register', isAuthenticated, async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }

    const { routes } = req.body;

    if (!Array.isArray(routes)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Routes must be an array' 
      });
    }

    const result = await registerRoutesUtil(routes);
    
    res.json({
      success: result.success,
      data: result,
    });
  } catch (error) {
    console.error('[Register Routes] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to register routes' 
    });
  }
});

/**
 * GET /api/pages/metadata
 * Get all page metadata
 */
router.get('/api/pages/metadata', async (req: Request, res: Response) => {
  try {
    const pages = await db.select().from(pageMetadata).where((t) => t.isActive === true);
    
    res.json({
      success: true,
      data: pages,
      count: pages.length,
    });
  } catch (error) {
    console.error('[Get Page Metadata] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch page metadata' 
    });
  }
});

/**
 * POST /api/pages/metadata
 * Create or update page metadata
 * Admin only
 */
router.post('/api/pages/metadata', isAuthenticated, async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }

    const pageData = req.body;

    if (!pageData.path || !pageData.title) {
      return res.status(400).json({ 
        success: false, 
        error: 'Path and title are required' 
      });
    }

    // Check if page already exists
    const existing = await db
      .select()
      .from(pageMetadata)
      .where((t) => t.path === pageData.path)
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await db.update(pageMetadata)
        .set({
          ...pageData,
          updatedAt: new Date(),
        })
        .where((t) => t.path === pageData.path);

      return res.json({
        success: true,
        message: 'Page metadata updated',
        data: pageData,
      });
    }

    // Create new
    await db.insert(pageMetadata).values(pageData);

    res.json({
      success: true,
      message: 'Page metadata created',
      data: pageData,
    });
  } catch (error) {
    console.error('[Create/Update Page Metadata] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save page metadata' 
    });
  }
});

/**
 * GET /api/pages/by-category/:category
 * Get pages by category
 */
router.get('/api/pages/by-category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const pages = await db
      .select()
      .from(pageMetadata)
      .where((t) => t.category === category && t.isActive === true)
      .orderBy((t) => t.displayOrder || 0);

    res.json({
      success: true,
      data: pages,
      count: pages.length,
    });
  } catch (error) {
    console.error('[Get Pages by Category] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch pages' 
    });
  }
});

export default router;
