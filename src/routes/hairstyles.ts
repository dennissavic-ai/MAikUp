import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { optionalAuth } from '../middleware/auth';
import { AuthenticatedRequest, HairstyleFilterQuery } from '../types';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { parsePagination } from '../utils/pagination';
import { Prisma } from '@prisma/client';

const router = Router();

// Get all hairstyle categories and subcategories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.hairstyle.groupBy({
      by: ['category', 'subcategory'],
      _count: { id: true },
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { subcategory: 'asc' }],
    });

    const grouped = categories.reduce((acc, item) => {
      const cat = item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({
        subcategory: item.subcategory,
        count: item._count.id,
      });
      return acc;
    }, {} as Record<string, { subcategory: string; count: number }[]>);

    sendSuccess(res, grouped);
  } catch (error) {
    sendError(res, 'Failed to fetch categories', 500);
  }
});

// Get hairstyles with filtering
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = req.query as HairstyleFilterQuery;
    const { page, limit, skip } = parsePagination(query.page, query.limit);

    const where: Prisma.HairstyleWhereInput = {
      isActive: true,
    };

    if (query.category) where.category = query.category.toUpperCase() as any;
    if (query.subcategory) where.subcategory = query.subcategory;
    if (query.length) where.length = query.length;
    if (query.texture) where.texture = query.texture;
    if (query.tier) where.tier = query.tier.toUpperCase() as any;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.tags) {
      where.tags = { hasSome: query.tags.split(',') };
    }

    const [hairstyles, total] = await Promise.all([
      prisma.hairstyle.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.hairstyle.count({ where }),
    ]);

    sendPaginated(res, hairstyles, { page, limit, total });
  } catch (error) {
    sendError(res, 'Failed to fetch hairstyles', 500);
  }
});

// Get a single hairstyle
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const hairstyle = await prisma.hairstyle.findUnique({
      where: { id: req.params.id as string },
    });

    if (!hairstyle) {
      sendError(res, 'Hairstyle not found', 404);
      return;
    }

    sendSuccess(res, hairstyle);
  } catch (error) {
    sendError(res, 'Failed to fetch hairstyle', 500);
  }
});

export default router;
