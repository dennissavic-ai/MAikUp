import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as schemas from '../validation/schemas';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import crypto from 'crypto';

const router = Router();

// Share a saved look (generate shareable link)
router.post('/:savedLookId', authenticate, validate(schemas.savedLookIdParams, 'params'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const savedLookId = req.params.savedLookId as string;

    // Verify the look belongs to the user
    const savedLook = await prisma.savedLook.findFirst({
      where: { id: savedLookId, userId: req.user!.userId },
    });

    if (!savedLook) {
      sendError(res, 'Look not found', 404);
      return;
    }

    // Check if already shared
    const existing = await prisma.sharedLook.findFirst({
      where: { savedLookId, userId: req.user!.userId },
    });

    if (existing) {
      sendSuccess(res, {
        shareCode: existing.shareCode,
        shareUrl: `/shared/${existing.shareCode}`,
      });
      return;
    }

    // Generate unique share code
    const shareCode = crypto.randomBytes(6).toString('base64url');

    const shared = await prisma.sharedLook.create({
      data: {
        savedLookId,
        userId: req.user!.userId,
        shareCode,
      },
    });

    sendSuccess(res, {
      shareCode: shared.shareCode,
      shareUrl: `/shared/${shared.shareCode}`,
    }, 'Look shared successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to share look', 500);
  }
});

// View a shared look (public, no auth required)
router.get('/view/:shareCode', validate(schemas.shareCodeParams, 'params'), async (req: Request, res: Response) => {
  try {
    const shareCode = req.params.shareCode as string;

    const shared = await prisma.sharedLook.findUnique({
      where: { shareCode },
      include: {
        savedLook: true,
        user: {
          select: { displayName: true, photoUrl: true },
        },
      },
    });

    if (!shared || !shared.isPublic) {
      sendError(res, 'Shared look not found', 404);
      return;
    }

    // Increment view count
    await prisma.sharedLook.update({
      where: { id: shared.id },
      data: { viewCount: { increment: 1 } },
    });

    sendSuccess(res, {
      look: shared.savedLook,
      sharedBy: shared.user,
      viewCount: shared.viewCount + 1,
      sharedAt: shared.createdAt,
    });
  } catch (error) {
    sendError(res, 'Failed to fetch shared look', 500);
  }
});

// Unshare a look
router.delete('/:savedLookId', authenticate, validate(schemas.savedLookIdParams, 'params'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.sharedLook.deleteMany({
      where: {
        savedLookId: req.params.savedLookId as string,
        userId: req.user!.userId,
      },
    });

    sendSuccess(res, null, 'Look unshared');
  } catch (error) {
    sendError(res, 'Failed to unshare look', 500);
  }
});

// Get my shared looks
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const shared = await prisma.sharedLook.findMany({
      where: { userId: req.user!.userId },
      include: { savedLook: true },
      orderBy: { createdAt: 'desc' },
    });

    sendSuccess(res, shared);
  } catch (error) {
    sendError(res, 'Failed to fetch shared looks', 500);
  }
});

export default router;
