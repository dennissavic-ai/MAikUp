import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as schemas from '../validation/schemas';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendPaginated, sendError } from '../utils/response';
import { parsePagination } from '../utils/pagination';

const router = Router();

// Get user's saved looks
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page, limit, skip } = parsePagination(
      req.query.page as string,
      req.query.limit as string
    );

    const [looks, total] = await Promise.all([
      prisma.savedLook.findMany({
        where: { userId: req.user!.userId },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.savedLook.count({ where: { userId: req.user!.userId } }),
    ]);

    sendPaginated(res, looks, { page, limit, total });
  } catch (error) {
    sendError(res, 'Failed to fetch saved looks', 500);
  }
});

// Save a new look
router.post('/', authenticate, validate(schemas.saveLook), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, lookData, imageUrl } = req.body;

    // Check tier limits on saved looks
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.userId },
    });

    const savedCount = await prisma.savedLook.count({
      where: { userId: req.user!.userId },
    });

    const limits: Record<string, number> = { FREE: 5, BASIC: 25, PREMIUM: Infinity };
    const maxLooks = limits[subscription?.tier || 'FREE'];

    if (savedCount >= maxLooks) {
      sendError(res, `You've reached the maximum of ${maxLooks} saved looks for your plan. Upgrade for more.`, 403);
      return;
    }

    const look = await prisma.savedLook.create({
      data: {
        userId: req.user!.userId,
        name,
        lookData,
        imageUrl,
      },
    });

    sendSuccess(res, look, 'Look saved successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to save look', 500);
  }
});

// Update a saved look
router.patch('/:id', authenticate, validate(schemas.updateLook), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, lookData, imageUrl } = req.body;

    const existing = await prisma.savedLook.findFirst({
      where: { id: req.params.id as string, userId: req.user!.userId },
    });

    if (!existing) {
      sendError(res, 'Look not found', 404);
      return;
    }

    const look = await prisma.savedLook.update({
      where: { id: req.params.id as string },
      data: {
        ...(name !== undefined && { name }),
        ...(lookData !== undefined && { lookData }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });

    sendSuccess(res, look, 'Look updated successfully');
  } catch (error) {
    sendError(res, 'Failed to update look', 500);
  }
});

// Delete a saved look
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = await prisma.savedLook.findFirst({
      where: { id: req.params.id as string, userId: req.user!.userId },
    });

    if (!existing) {
      sendError(res, 'Look not found', 404);
      return;
    }

    await prisma.savedLook.delete({ where: { id: req.params.id as string } });

    sendSuccess(res, null, 'Look deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete look', 500);
  }
});

// Record look history (when user tries on a look)
router.post('/history', authenticate, validate(schemas.recordHistory), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { lookData } = req.body;

    const history = await prisma.lookHistory.create({
      data: {
        userId: req.user!.userId,
        lookData,
      },
    });

    sendSuccess(res, history, 'Look recorded in history', 201);
  } catch (error) {
    sendError(res, 'Failed to record look history', 500);
  }
});

// Get look history
router.get('/history', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page, limit, skip } = parsePagination(
      req.query.page as string,
      req.query.limit as string
    );

    const [history, total] = await Promise.all([
      prisma.lookHistory.findMany({
        where: { userId: req.user!.userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lookHistory.count({ where: { userId: req.user!.userId } }),
    ]);

    sendPaginated(res, history, { page, limit, total });
  } catch (error) {
    sendError(res, 'Failed to fetch look history', 500);
  }
});

export default router;
