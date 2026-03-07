import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate, optionalAuth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { buildTryOnSession, TryOnLayer, TryOnResult } from '../services/imageProcessor';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';

const router = Router();

// ─── In-Memory Session Store with TTL ────────────────────────

interface SessionEntry {
  result: TryOnResult;
  userId?: string;
  createdAt: number;
}

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const sessionStore = new Map<string, SessionEntry>();

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of sessionStore) {
    if (now - entry.createdAt > SESSION_TTL_MS) {
      sessionStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ─── POST /session - Create a try-on session ────────────────

router.post('/session', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productIds, lookId, hairstyleId, mode = 'client' } = req.body;

    // Validate that at least one source is provided
    if (!productIds?.length && !lookId && !hairstyleId) {
      sendError(res, 'Provide at least one of productIds, lookId, or hairstyleId');
      return;
    }

    if (mode !== 'client' && mode !== 'server') {
      sendError(res, 'Mode must be "client" or "server"');
      return;
    }

    // Collect all product IDs (resolve look if provided)
    let resolvedProductIds: string[] = productIds || [];

    if (lookId) {
      const look = await prisma.makeupLook.findUnique({
        where: { id: lookId },
        include: {
          products: {
            include: { product: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      if (!look) {
        sendError(res, 'Look not found', 404);
        return;
      }

      const lookProductIds = look.products.map((lp) => lp.productId);
      resolvedProductIds = [...new Set([...resolvedProductIds, ...lookProductIds])];
    }

    // Build the AR asset query
    const assetWhere: Prisma.ArAssetWhereInput = {
      isActive: true,
      OR: [],
    };

    if (resolvedProductIds.length > 0) {
      (assetWhere.OR as any[]).push({ productId: { in: resolvedProductIds } });
    }
    if (hairstyleId) {
      (assetWhere.OR as any[]).push({ hairstyleId });
    }

    // If OR is empty after all checks, something is wrong
    if (!(assetWhere.OR as any[]).length) {
      sendError(res, 'No valid products or hairstyles to try on');
      return;
    }

    const arAssets = await prisma.arAsset.findMany({
      where: assetWhere,
      orderBy: { version: 'desc' },
    });

    if (arAssets.length === 0) {
      sendError(res, 'No AR assets found for the selected items', 404);
      return;
    }

    // Deduplicate by productId/hairstyleId (keep latest version)
    const seenKeys = new Set<string>();
    const uniqueAssets = arAssets.filter((asset) => {
      const key = asset.productId || asset.hairstyleId || asset.id;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    // Map AR assets to TryOnLayer format
    const layers: TryOnLayer[] = uniqueAssets.map((asset) => ({
      assetId: asset.id,
      assetType: asset.assetType,
      textureUrl: asset.textureUrl || undefined,
      modelUrl: asset.modelUrl,
      anchorPoint: asset.anchorPoint || 'full_face',
      blendMode: asset.blendMode || 'normal',
      opacity: asset.opacity,
      scale: (asset.scale as { x: number; y: number; z: number } | null) || undefined,
      offset: (asset.offset as { x: number; y: number; z: number } | null) || undefined,
    }));

    const sessionId = randomUUID();

    // Build the session via the image processor
    const result = await buildTryOnSession({
      sessionId,
      userId: req.user?.userId,
      mode,
      layers,
    });

    // Store session
    sessionStore.set(sessionId, {
      result,
      userId: req.user?.userId,
      createdAt: Date.now(),
    });

    // Record analytics event (fire-and-forget)
    prisma.analyticsEvent
      .create({
        data: {
          eventType: 'try_on_session_start',
          entityId: lookId || hairstyleId || resolvedProductIds[0] || null,
          entityType: lookId ? 'makeup_look' : hairstyleId ? 'hairstyle' : 'makeup_product',
          userId: req.user?.userId,
          metadata: {
            sessionId,
            mode,
            productCount: resolvedProductIds.length,
            hasHairstyle: !!hairstyleId,
            hasLook: !!lookId,
          },
        },
      })
      .catch(() => {
        // Analytics failure should not affect the response
      });

    sendSuccess(res, result, 'Try-on session created', 201);
  } catch (error) {
    sendError(res, 'Failed to create try-on session', 500);
  }
});

// ─── GET /session/:sessionId - Retrieve an existing session ──

router.get('/session/:sessionId', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const entry = sessionStore.get(sessionId as string);

    if (!entry) {
      sendError(res, 'Session not found or expired', 404);
      return;
    }

    // Check if session has expired
    if (Date.now() - entry.createdAt > SESSION_TTL_MS) {
      sessionStore.delete(sessionId as string);
      sendError(res, 'Session expired', 410);
      return;
    }

    sendSuccess(res, entry.result);
  } catch (error) {
    sendError(res, 'Failed to retrieve try-on session', 500);
  }
});

// ─── POST /session/:sessionId/adjust - Adjust a layer ────────

router.post('/session/:sessionId/adjust', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { layerIndex, opacity, scale, offset } = req.body;

    const entry = sessionStore.get(sessionId as string);

    if (!entry) {
      sendError(res, 'Session not found or expired', 404);
      return;
    }

    // Check if session has expired
    if (Date.now() - entry.createdAt > SESSION_TTL_MS) {
      sessionStore.delete(sessionId as string);
      sendError(res, 'Session expired', 410);
      return;
    }

    // Validate ownership
    if (entry.userId && entry.userId !== req.user?.userId) {
      sendError(res, 'Not authorized to modify this session', 403);
      return;
    }

    // Validate layerIndex
    if (typeof layerIndex !== 'number' || layerIndex < 0 || layerIndex >= entry.result.layers.length) {
      sendError(res, `Invalid layerIndex. Must be between 0 and ${entry.result.layers.length - 1}`);
      return;
    }

    // Apply adjustments to the layer
    const layer = entry.result.layers[layerIndex];

    if (opacity !== undefined) {
      if (typeof opacity !== 'number' || opacity < 0 || opacity > 1) {
        sendError(res, 'Opacity must be a number between 0 and 1');
        return;
      }
      layer.opacity = opacity;
    }

    if (scale !== undefined) {
      layer.scale = { ...layer.scale, ...scale };
    }

    if (offset !== undefined) {
      layer.offset = { ...layer.offset, ...offset };
    }

    // Rebuild rendering instructions with updated layers
    const updatedResult = await buildTryOnSession({
      sessionId: entry.result.sessionId,
      userId: req.user?.userId,
      mode: entry.result.mode,
      layers: entry.result.layers,
    });

    // Update the stored session
    entry.result = updatedResult;

    sendSuccess(res, updatedResult, 'Layer adjusted');
  } catch (error) {
    sendError(res, 'Failed to adjust try-on layer', 500);
  }
});

export default router;
