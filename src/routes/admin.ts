import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { validate } from '../middleware/validate';
import * as schemas from '../validation/schemas';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { parsePagination } from '../utils/pagination';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// ─── Dashboard Stats ─────────────────────────────────────────

router.get('/stats', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalUsers,
      activeSubscriptions,
      totalProducts,
      totalHairstyles,
      totalLooks,
      recentSignups,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({
        where: { status: 'ACTIVE', tier: { not: 'FREE' } },
      }),
      prisma.makeupProduct.count({ where: { isActive: true } }),
      prisma.hairstyle.count({ where: { isActive: true } }),
      prisma.makeupLook.count({ where: { isActive: true } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const subscriptionBreakdown = await prisma.subscription.groupBy({
      by: ['tier'],
      _count: { id: true },
      where: { status: 'ACTIVE' },
    });

    sendSuccess(res, {
      totalUsers,
      activeSubscriptions,
      totalProducts,
      totalHairstyles,
      totalLooks,
      recentSignups,
      subscriptionBreakdown: subscriptionBreakdown.map((s) => ({
        tier: s.tier,
        count: s._count.id,
      })),
    });
  } catch (error) {
    sendError(res, 'Failed to fetch stats', 500);
  }
});

// ─── User Management ─────────────────────────────────────────

router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page, limit, skip } = parsePagination(
      req.query.page as string,
      req.query.limit as string
    );
    const search = req.query.search as string;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { subscription: true, _count: { select: { favorites: true, savedLooks: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    sendPaginated(res, users, { page, limit, total });
  } catch (error) {
    sendError(res, 'Failed to fetch users', 500);
  }
});

router.patch('/users/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) {
      sendError(res, 'Invalid role');
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.params.id as string },
      data: { role },
    });

    sendSuccess(res, user, 'User role updated');
  } catch (error) {
    sendError(res, 'Failed to update user role', 500);
  }
});

// ─── Makeup Product Management ───────────────────────────────

router.post('/products', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const product = await prisma.makeupProduct.create({
      data: req.body,
    });

    sendSuccess(res, product, 'Product created', 201);
  } catch (error) {
    sendError(res, 'Failed to create product', 500);
  }
});

router.patch('/products/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const product = await prisma.makeupProduct.update({
      where: { id: req.params.id as string },
      data: req.body,
    });

    sendSuccess(res, product, 'Product updated');
  } catch (error) {
    sendError(res, 'Failed to update product', 500);
  }
});

router.delete('/products/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.makeupProduct.update({
      where: { id: req.params.id as string },
      data: { isActive: false },
    });

    sendSuccess(res, null, 'Product deactivated');
  } catch (error) {
    sendError(res, 'Failed to deactivate product', 500);
  }
});

// ─── Hairstyle Management ────────────────────────────────────

router.post('/hairstyles', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const hairstyle = await prisma.hairstyle.create({
      data: req.body,
    });

    sendSuccess(res, hairstyle, 'Hairstyle created', 201);
  } catch (error) {
    sendError(res, 'Failed to create hairstyle', 500);
  }
});

router.patch('/hairstyles/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const hairstyle = await prisma.hairstyle.update({
      where: { id: req.params.id as string },
      data: req.body,
    });

    sendSuccess(res, hairstyle, 'Hairstyle updated');
  } catch (error) {
    sendError(res, 'Failed to update hairstyle', 500);
  }
});

router.delete('/hairstyles/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.hairstyle.update({
      where: { id: req.params.id as string },
      data: { isActive: false },
    });

    sendSuccess(res, null, 'Hairstyle deactivated');
  } catch (error) {
    sendError(res, 'Failed to deactivate hairstyle', 500);
  }
});

// ─── Look Management ─────────────────────────────────────────

router.post('/looks', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productIds, ...lookData } = req.body;

    const look = await prisma.makeupLook.create({
      data: {
        ...lookData,
        products: productIds
          ? {
              create: productIds.map((productId: string, i: number) => ({
                productId,
                sortOrder: i,
              })),
            }
          : undefined,
      },
      include: { products: { include: { product: true } } },
    });

    sendSuccess(res, look, 'Look created', 201);
  } catch (error) {
    sendError(res, 'Failed to create look', 500);
  }
});

router.patch('/looks/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productIds, ...lookData } = req.body;

    // Update look data
    const look = await prisma.makeupLook.update({
      where: { id: req.params.id as string },
      data: lookData,
    });

    // If productIds provided, replace all associations
    if (productIds) {
      await prisma.lookProduct.deleteMany({ where: { lookId: look.id } });
      await Promise.all(
        productIds.map((productId: string, i: number) =>
          prisma.lookProduct.create({
            data: { lookId: look.id, productId, sortOrder: i },
          })
        )
      );
    }

    const updated = await prisma.makeupLook.findUnique({
      where: { id: look.id },
      include: { products: { include: { product: true } } },
    });

    sendSuccess(res, updated, 'Look updated');
  } catch (error) {
    sendError(res, 'Failed to update look', 500);
  }
});

router.delete('/looks/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.makeupLook.update({
      where: { id: req.params.id as string },
      data: { isActive: false },
    });

    sendSuccess(res, null, 'Look deactivated');
  } catch (error) {
    sendError(res, 'Failed to deactivate look', 500);
  }
});

export default router;
