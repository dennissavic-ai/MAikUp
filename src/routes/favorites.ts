import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { parsePagination } from '../utils/pagination';

const router = Router();

// Get user's favorites
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page, limit, skip } = parsePagination(
      req.query.page as string,
      req.query.limit as string
    );
    const type = req.query.type as string; // "makeup" or "hairstyle"

    const where: any = { userId: req.user!.userId };
    if (type === 'makeup') {
      where.productId = { not: null };
      where.hairstyleId = null;
    } else if (type === 'hairstyle') {
      where.hairstyleId = { not: null };
      where.productId = null;
    }

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        include: {
          product: true,
          hairstyle: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.favorite.count({ where }),
    ]);

    sendPaginated(res, favorites, { page, limit, total });
  } catch (error) {
    sendError(res, 'Failed to fetch favorites', 500);
  }
});

// Add a makeup product to favorites
router.post('/makeup/:productId', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user!.userId,
        productId: req.params.productId as string,
      },
      include: { product: true },
    });

    sendSuccess(res, favorite, 'Added to favorites', 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      sendError(res, 'Already in favorites');
      return;
    }
    sendError(res, 'Failed to add to favorites', 500);
  }
});

// Add a hairstyle to favorites
router.post('/hairstyle/:hairstyleId', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user!.userId,
        hairstyleId: req.params.hairstyleId as string,
      },
      include: { hairstyle: true },
    });

    sendSuccess(res, favorite, 'Added to favorites', 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      sendError(res, 'Already in favorites');
      return;
    }
    sendError(res, 'Failed to add to favorites', 500);
  }
});

// Remove a makeup product from favorites
router.delete('/makeup/:productId', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: req.user!.userId,
        productId: req.params.productId as string,
      },
    });

    sendSuccess(res, null, 'Removed from favorites');
  } catch (error) {
    sendError(res, 'Failed to remove from favorites', 500);
  }
});

// Remove a hairstyle from favorites
router.delete('/hairstyle/:hairstyleId', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: req.user!.userId,
        hairstyleId: req.params.hairstyleId as string,
      },
    });

    sendSuccess(res, null, 'Removed from favorites');
  } catch (error) {
    sendError(res, 'Failed to remove from favorites', 500);
  }
});

export default router;
