import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// Get current user profile
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        subscription: true,
        _count: {
          select: {
            favorites: true,
            savedLooks: true,
          },
        },
      },
    });

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, user);
  } catch (error) {
    sendError(res, 'Failed to fetch user profile', 500);
  }
});

// Update user profile
router.patch('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { displayName, photoUrl, skinTone, skinUndertone, faceShape } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(skinTone !== undefined && { skinTone }),
        ...(skinUndertone !== undefined && { skinUndertone }),
        ...(faceShape !== undefined && { faceShape }),
      },
      include: { subscription: true },
    });

    sendSuccess(res, user, 'Profile updated successfully');
  } catch (error) {
    sendError(res, 'Failed to update profile', 500);
  }
});

// Delete user account
router.delete('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: req.user!.userId },
    });

    sendSuccess(res, null, 'Account deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete account', 500);
  }
});

export default router;
