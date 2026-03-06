import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate, optionalAuth } from '../middleware/auth';
import { AuthenticatedRequest, CatalogFilterQuery } from '../types';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { parsePagination } from '../utils/pagination';
import { Prisma } from '@prisma/client';

const router = Router();

// Get all makeup categories and subcategories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.makeupProduct.groupBy({
      by: ['category', 'subcategory'],
      _count: { id: true },
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { subcategory: 'asc' }],
    });

    // Group by category
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

// Get makeup products with filtering
router.get('/products', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = req.query as CatalogFilterQuery;
    const { page, limit, skip } = parsePagination(query.page, query.limit);

    const where: Prisma.MakeupProductWhereInput = {
      isActive: true,
    };

    if (query.category) {
      where.category = query.category.toUpperCase() as any;
    }
    if (query.subcategory) {
      where.subcategory = query.subcategory;
    }
    if (query.finish) {
      where.finish = query.finish;
    }
    if (query.tier) {
      where.tier = query.tier.toUpperCase() as any;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { colorName: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.tags) {
      where.tags = { hasSome: query.tags.split(',') };
    }

    const [products, total] = await Promise.all([
      prisma.makeupProduct.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.makeupProduct.count({ where }),
    ]);

    sendPaginated(res, products, { page, limit, total });
  } catch (error) {
    sendError(res, 'Failed to fetch products', 500);
  }
});

// Get a single makeup product
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.makeupProduct.findUnique({
      where: { id: req.params.id as string },
    });

    if (!product) {
      sendError(res, 'Product not found', 404);
      return;
    }

    sendSuccess(res, product);
  } catch (error) {
    sendError(res, 'Failed to fetch product', 500);
  }
});

// Get predefined makeup looks
router.get('/looks', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = req.query as CatalogFilterQuery & { style?: string; occasion?: string; difficulty?: string };
    const { page, limit, skip } = parsePagination(query.page, query.limit);

    const where: Prisma.MakeupLookWhereInput = {
      isActive: true,
    };

    if (query.style) where.style = query.style;
    if (query.occasion) where.occasion = query.occasion;
    if (query.difficulty) where.difficulty = query.difficulty;
    if (query.tier) where.tier = query.tier.toUpperCase() as any;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [looks, total] = await Promise.all([
      prisma.makeupLook.findMany({
        where,
        include: {
          products: {
            include: { product: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.makeupLook.count({ where }),
    ]);

    sendPaginated(res, looks, { page, limit, total });
  } catch (error) {
    sendError(res, 'Failed to fetch looks', 500);
  }
});

// Get a single makeup look with products
router.get('/looks/:id', async (req: Request, res: Response) => {
  try {
    const look = await prisma.makeupLook.findUnique({
      where: { id: req.params.id as string },
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

    sendSuccess(res, look);
  } catch (error) {
    sendError(res, 'Failed to fetch look', 500);
  }
});

// Get available finishes
router.get('/finishes', async (_req: Request, res: Response) => {
  try {
    const finishes = await prisma.makeupProduct.groupBy({
      by: ['finish'],
      _count: { id: true },
      where: { isActive: true, finish: { not: null } },
      orderBy: { finish: 'asc' },
    });

    sendSuccess(
      res,
      finishes.map((f) => ({ finish: f.finish, count: f._count.id }))
    );
  } catch (error) {
    sendError(res, 'Failed to fetch finishes', 500);
  }
});

export default router;
