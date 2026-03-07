import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// Unified search across all catalogs
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const type = req.query.type as string; // "all", "makeup", "hairstyles", "looks"
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

    if (!q || q.trim().length < 2) {
      sendError(res, 'Search query must be at least 2 characters');
      return;
    }

    const searchTerm = q.trim();
    const searchType = type || 'all';

    const results: {
      products?: any[];
      looks?: any[];
      hairstyles?: any[];
    } = {};

    // Search makeup products
    if (searchType === 'all' || searchType === 'makeup') {
      results.products = await prisma.makeupProduct.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { colorName: { contains: searchTerm, mode: 'insensitive' } },
            { subcategory: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm.toLowerCase()] } },
          ],
        },
        take: limit,
        orderBy: { sortOrder: 'asc' },
      });
    }

    // Search makeup looks
    if (searchType === 'all' || searchType === 'looks') {
      results.looks = await prisma.makeupLook.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { style: { contains: searchTerm, mode: 'insensitive' } },
            { occasion: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm.toLowerCase()] } },
          ],
        },
        include: {
          products: {
            include: { product: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
        take: limit,
        orderBy: { sortOrder: 'asc' },
      });
    }

    // Search hairstyles
    if (searchType === 'all' || searchType === 'hairstyles') {
      results.hairstyles = await prisma.hairstyle.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { subcategory: { contains: searchTerm, mode: 'insensitive' } },
            { colorName: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { hasSome: [searchTerm.toLowerCase()] } },
          ],
        },
        take: limit,
        orderBy: { sortOrder: 'asc' },
      });
    }

    const totalResults =
      (results.products?.length || 0) +
      (results.looks?.length || 0) +
      (results.hairstyles?.length || 0);

    sendSuccess(res, {
      query: searchTerm,
      totalResults,
      ...results,
    });
  } catch (error) {
    sendError(res, 'Search failed', 500);
  }
});

// Autocomplete / suggestions
router.get('/suggest', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;

    if (!q || q.trim().length < 1) {
      sendSuccess(res, []);
      return;
    }

    const searchTerm = q.trim();
    const limit = 8;

    // Get quick suggestions from product names, look names, hairstyle names
    const [products, looks, hairstyles] = await Promise.all([
      prisma.makeupProduct.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { colorName: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, category: true, subcategory: true },
        take: limit,
      }),
      prisma.makeupLook.findMany({
        where: {
          isActive: true,
          name: { contains: searchTerm, mode: 'insensitive' },
        },
        select: { id: true, name: true, style: true },
        take: limit,
      }),
      prisma.hairstyle.findMany({
        where: {
          isActive: true,
          name: { contains: searchTerm, mode: 'insensitive' },
        },
        select: { id: true, name: true, category: true },
        take: limit,
      }),
    ]);

    const suggestions = [
      ...products.map((p) => ({
        type: 'product' as const,
        id: p.id,
        text: p.name,
        detail: `${p.category} - ${p.subcategory}`,
      })),
      ...looks.map((l) => ({
        type: 'look' as const,
        id: l.id,
        text: l.name,
        detail: l.style,
      })),
      ...hairstyles.map((h) => ({
        type: 'hairstyle' as const,
        id: h.id,
        text: h.name,
        detail: h.category,
      })),
    ].slice(0, 10);

    sendSuccess(res, suggestions);
  } catch (error) {
    sendError(res, 'Suggestions failed', 500);
  }
});

export default router;
