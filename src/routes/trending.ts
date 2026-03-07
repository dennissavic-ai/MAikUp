import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// ─── Public Endpoints ────────────────────────────────────────

// Get featured/trending content for home screen
router.get('/', async (req: Request, res: Response) => {
  try {
    const section = req.query.section as string;
    const now = new Date();

    const where: any = {
      isActive: true,
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } },
      ],
    };

    if (section) {
      where.section = section;
    }

    const featured = await prisma.featuredItem.findMany({
      where,
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });

    // Group by section
    const grouped = featured.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {} as Record<string, typeof featured>);

    sendSuccess(res, grouped);
  } catch (error) {
    sendError(res, 'Failed to fetch featured content', 500);
  }
});

// Get auto-generated trending based on analytics (last 7 days)
router.get('/auto', async (_req: Request, res: Response) => {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get top products
    const topProducts = await prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      _count: { id: true },
      where: {
        entityType: 'makeup_product',
        eventType: { in: ['product_view', 'product_try'] },
        createdAt: { gte: since },
        entityId: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Get top looks
    const topLooks = await prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      _count: { id: true },
      where: {
        entityType: 'makeup_look',
        eventType: { in: ['look_view', 'look_try'] },
        createdAt: { gte: since },
        entityId: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Get top hairstyles
    const topHairstyles = await prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      _count: { id: true },
      where: {
        entityType: 'hairstyle',
        eventType: { in: ['hairstyle_view', 'hairstyle_try'] },
        createdAt: { gte: since },
        entityId: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Fetch full entities
    const productIds = topProducts.map((e) => e.entityId).filter((id): id is string => id !== null);
    const lookIds = topLooks.map((e) => e.entityId).filter((id): id is string => id !== null);
    const hairstyleIds = topHairstyles.map((e) => e.entityId).filter((id): id is string => id !== null);

    const [products, looks, hairstyles] = await Promise.all([
      prisma.makeupProduct.findMany({ where: { id: { in: productIds }, isActive: true } }),
      prisma.makeupLook.findMany({ where: { id: { in: lookIds }, isActive: true } }),
      prisma.hairstyle.findMany({ where: { id: { in: hairstyleIds }, isActive: true } }),
    ]);

    // Merge with counts and maintain ranking order
    const trendingProducts = topProducts.map((e) => ({
      ...products.find((p) => p.id === e.entityId),
      trendScore: e._count.id,
    })).filter((p) => p.id);

    const trendingLooks = topLooks.map((e) => ({
      ...looks.find((l) => l.id === e.entityId),
      trendScore: e._count.id,
    })).filter((l) => l.id);

    const trendingHairstyles = topHairstyles.map((e) => ({
      ...hairstyles.find((h) => h.id === e.entityId),
      trendScore: e._count.id,
    })).filter((h) => h.id);

    sendSuccess(res, {
      period: '7 days',
      trending: {
        products: trendingProducts,
        looks: trendingLooks,
        hairstyles: trendingHairstyles,
      },
    });
  } catch (error) {
    sendError(res, 'Failed to fetch trending content', 500);
  }
});

// ─── Admin Endpoints ─────────────────────────────────────────

// Create featured item
router.post('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const item = await prisma.featuredItem.create({ data: req.body });
    sendSuccess(res, item, 'Featured item created', 201);
  } catch (error) {
    sendError(res, 'Failed to create featured item', 500);
  }
});

// Update featured item
router.patch('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const item = await prisma.featuredItem.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    sendSuccess(res, item, 'Featured item updated');
  } catch (error) {
    sendError(res, 'Failed to update featured item', 500);
  }
});

// Delete featured item
router.delete('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.featuredItem.delete({ where: { id: req.params.id as string } });
    sendSuccess(res, null, 'Featured item deleted');
  } catch (error) {
    sendError(res, 'Failed to delete featured item', 500);
  }
});

// Reorder featured items
router.post('/reorder', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items } = req.body; // [{ id: "...", position: 0 }, ...]

    if (!Array.isArray(items)) {
      sendError(res, 'items array is required');
      return;
    }

    await Promise.all(
      items.map((item: { id: string; position: number }) =>
        prisma.featuredItem.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    sendSuccess(res, null, 'Items reordered');
  } catch (error) {
    sendError(res, 'Failed to reorder items', 500);
  }
});

export default router;
