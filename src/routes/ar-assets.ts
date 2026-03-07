import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate, optionalAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { parsePagination } from '../utils/pagination';
import { Prisma } from '@prisma/client';

const router = Router();

// ─── Public Endpoints ────────────────────────────────────────

// Get AR assets for a specific makeup product
router.get('/product/:productId', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const assets = await prisma.arAsset.findMany({
      where: {
        productId: req.params.productId as string,
        isActive: true,
      },
      orderBy: { version: 'desc' },
    });

    if (assets.length === 0) {
      sendError(res, 'No AR assets found for this product', 404);
      return;
    }

    sendSuccess(res, assets);
  } catch (error) {
    sendError(res, 'Failed to fetch AR assets', 500);
  }
});

// Get AR assets for a specific hairstyle
router.get('/hairstyle/:hairstyleId', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const assets = await prisma.arAsset.findMany({
      where: {
        hairstyleId: req.params.hairstyleId as string,
        isActive: true,
      },
      orderBy: { version: 'desc' },
    });

    if (assets.length === 0) {
      sendError(res, 'No AR assets found for this hairstyle', 404);
      return;
    }

    sendSuccess(res, assets);
  } catch (error) {
    sendError(res, 'Failed to fetch AR assets', 500);
  }
});

// Batch fetch AR assets for multiple products (for preloading a full look)
router.post('/batch', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productIds, hairstyleIds } = req.body;

    if (!productIds?.length && !hairstyleIds?.length) {
      sendError(res, 'Provide productIds and/or hairstyleIds arrays');
      return;
    }

    const where: Prisma.ArAssetWhereInput = {
      isActive: true,
      OR: [],
    };

    if (productIds?.length) {
      (where.OR as any[]).push({ productId: { in: productIds } });
    }
    if (hairstyleIds?.length) {
      (where.OR as any[]).push({ hairstyleId: { in: hairstyleIds } });
    }

    const assets = await prisma.arAsset.findMany({
      where,
      orderBy: { version: 'desc' },
    });

    // Group by product/hairstyle ID for easier consumption
    const grouped: Record<string, typeof assets> = {};
    for (const asset of assets) {
      const key = asset.productId || asset.hairstyleId || 'unknown';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(asset);
    }

    sendSuccess(res, grouped);
  } catch (error) {
    sendError(res, 'Failed to batch fetch AR assets', 500);
  }
});

// Get AR asset manifest (lightweight list for cache checking)
router.get('/manifest', async (req: Request, res: Response) => {
  try {
    const since = req.query.since as string;

    const where: Prisma.ArAssetWhereInput = { isActive: true };
    if (since) {
      where.updatedAt = { gte: new Date(since) };
    }

    const assets = await prisma.arAsset.findMany({
      where,
      select: {
        id: true,
        productId: true,
        hairstyleId: true,
        assetType: true,
        version: true,
        fileSizeBytes: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    sendSuccess(res, {
      count: assets.length,
      totalSizeBytes: assets.reduce((sum, a) => sum + (a.fileSizeBytes || 0), 0),
      assets,
    });
  } catch (error) {
    sendError(res, 'Failed to fetch AR manifest', 500);
  }
});

// ─── Admin Endpoints ─────────────────────────────────────────

// List all AR assets (admin)
router.get('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = req.query;
    const { page, limit, skip } = parsePagination(query.page as string, query.limit as string);

    const where: Prisma.ArAssetWhereInput = {};
    if (query.assetType) where.assetType = (query.assetType as string).toUpperCase() as any;
    if (query.productId) where.productId = query.productId as string;
    if (query.hairstyleId) where.hairstyleId = query.hairstyleId as string;

    const [assets, total] = await Promise.all([
      prisma.arAsset.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.arAsset.count({ where }),
    ]);

    sendPaginated(res, assets, { page, limit, total });
  } catch (error) {
    sendError(res, 'Failed to fetch AR assets', 500);
  }
});

// Create AR asset (admin)
router.post('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const asset = await prisma.arAsset.create({ data: req.body });
    sendSuccess(res, asset, 'AR asset created', 201);
  } catch (error) {
    sendError(res, 'Failed to create AR asset', 500);
  }
});

// Update AR asset (admin)
router.patch('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const asset = await prisma.arAsset.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    sendSuccess(res, asset, 'AR asset updated');
  } catch (error) {
    sendError(res, 'Failed to update AR asset', 500);
  }
});

// Delete AR asset (admin)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.arAsset.update({
      where: { id: req.params.id as string },
      data: { isActive: false },
    });
    sendSuccess(res, null, 'AR asset deactivated');
  } catch (error) {
    sendError(res, 'Failed to deactivate AR asset', 500);
  }
});

export default router;
