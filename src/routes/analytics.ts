import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate, optionalAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { validate } from '../middleware/validate';
import * as schemas from '../validation/schemas';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// Track an analytics event (from mobile app)
router.post('/track', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { eventType, entityId, entityType, metadata } = req.body;

    if (!eventType) {
      sendError(res, 'eventType is required');
      return;
    }

    await prisma.analyticsEvent.create({
      data: {
        eventType,
        entityId,
        entityType,
        userId: req.user?.userId || null,
        metadata,
      },
    });

    sendSuccess(res, null, 'Event tracked', 201);
  } catch (error) {
    sendError(res, 'Failed to track event', 500);
  }
});

// ─── Admin Analytics Endpoints ───────────────────────────────

// Get popular products
router.get('/popular/products', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const limit = parseInt(req.query.limit as string) || 20;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const events = await prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      _count: { id: true },
      where: {
        eventType: { in: ['product_view', 'product_try'] },
        entityType: 'makeup_product',
        createdAt: { gte: since },
        entityId: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    const productIds = events
      .map((e) => e.entityId)
      .filter((id): id is string => id !== null);

    const products = await prisma.makeupProduct.findMany({
      where: { id: { in: productIds } },
    });

    const result = events.map((e) => ({
      product: products.find((p) => p.id === e.entityId),
      viewCount: e._count.id,
    }));

    sendSuccess(res, { period: `${days} days`, data: result });
  } catch (error) {
    sendError(res, 'Failed to fetch popular products', 500);
  }
});

// Get popular looks
router.get('/popular/looks', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const limit = parseInt(req.query.limit as string) || 20;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const events = await prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      _count: { id: true },
      where: {
        eventType: { in: ['look_view', 'look_try'] },
        entityType: 'makeup_look',
        createdAt: { gte: since },
        entityId: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    const lookIds = events
      .map((e) => e.entityId)
      .filter((id): id is string => id !== null);

    const looks = await prisma.makeupLook.findMany({
      where: { id: { in: lookIds } },
    });

    const result = events.map((e) => ({
      look: looks.find((l) => l.id === e.entityId),
      viewCount: e._count.id,
    }));

    sendSuccess(res, { period: `${days} days`, data: result });
  } catch (error) {
    sendError(res, 'Failed to fetch popular looks', 500);
  }
});

// Get popular hairstyles
router.get('/popular/hairstyles', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const limit = parseInt(req.query.limit as string) || 20;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const events = await prisma.analyticsEvent.groupBy({
      by: ['entityId'],
      _count: { id: true },
      where: {
        eventType: { in: ['hairstyle_view', 'hairstyle_try'] },
        entityType: 'hairstyle',
        createdAt: { gte: since },
        entityId: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    const hairstyleIds = events
      .map((e) => e.entityId)
      .filter((id): id is string => id !== null);

    const hairstyles = await prisma.hairstyle.findMany({
      where: { id: { in: hairstyleIds } },
    });

    const result = events.map((e) => ({
      hairstyle: hairstyles.find((h) => h.id === e.entityId),
      viewCount: e._count.id,
    }));

    sendSuccess(res, { period: `${days} days`, data: result });
  } catch (error) {
    sendError(res, 'Failed to fetch popular hairstyles', 500);
  }
});

// Get event summary (overview)
router.get('/summary', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const events = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      _count: { id: true },
      where: { createdAt: { gte: since } },
      orderBy: { _count: { id: 'desc' } },
    });

    const uniqueUsers = await prisma.analyticsEvent.groupBy({
      by: ['userId'],
      where: {
        createdAt: { gte: since },
        userId: { not: null },
      },
    });

    sendSuccess(res, {
      period: `${days} days`,
      totalEvents: events.reduce((sum, e) => sum + e._count.id, 0),
      uniqueActiveUsers: uniqueUsers.length,
      eventBreakdown: events.map((e) => ({
        eventType: e.eventType,
        count: e._count.id,
      })),
    });
  } catch (error) {
    sendError(res, 'Failed to fetch analytics summary', 500);
  }
});

export default router;
