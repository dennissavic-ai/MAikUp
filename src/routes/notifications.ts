import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { validate } from '../middleware/validate';
import * as schemas from '../validation/schemas';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { firebaseAuth } from '../config/firebase';
import admin from 'firebase-admin';

const router = Router();

// Register a device token for push notifications
router.post('/register', authenticate, validate(schemas.registerDevice), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { token, platform } = req.body;

    // Upsert - update if token exists, create if not
    await prisma.deviceToken.upsert({
      where: { token },
      update: { userId: req.user!.userId, platform, isActive: true },
      create: { userId: req.user!.userId, token, platform },
    });

    sendSuccess(res, null, 'Device registered for notifications');
  } catch (error) {
    sendError(res, 'Failed to register device', 500);
  }
});

// Unregister a device token
router.delete('/unregister', authenticate, validate(schemas.unregisterDevice), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { token } = req.body;

    await prisma.deviceToken.updateMany({
      where: { token, userId: req.user!.userId },
      data: { isActive: false },
    });

    sendSuccess(res, null, 'Device unregistered');
  } catch (error) {
    sendError(res, 'Failed to unregister device', 500);
  }
});

// Send push notification to all users (admin only)
router.post('/send-all', authenticate, requireAdmin, validate(schemas.sendNotification), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, body, data, platform } = req.body;

    const where: any = { isActive: true };
    if (platform) where.platform = platform;

    const tokens = await prisma.deviceToken.findMany({
      where,
      select: { token: true },
    });

    if (tokens.length === 0) {
      sendSuccess(res, { sent: 0 }, 'No devices to notify');
      return;
    }

    const message: admin.messaging.MulticastMessage = {
      tokens: tokens.map((t) => t.token),
      notification: { title, body },
      data: data || undefined,
    };

    const result = await admin.messaging().sendEachForMulticast(message);

    // Deactivate failed tokens
    const failedTokens = result.responses
      .map((resp, i) => (!resp.success ? tokens[i].token : null))
      .filter((t): t is string => t !== null);

    if (failedTokens.length > 0) {
      await prisma.deviceToken.updateMany({
        where: { token: { in: failedTokens } },
        data: { isActive: false },
      });
    }

    sendSuccess(res, {
      sent: result.successCount,
      failed: result.failureCount,
      totalDevices: tokens.length,
    });
  } catch (error) {
    sendError(res, 'Failed to send notifications', 500);
  }
});

// Send push notification to specific tier (admin only)
router.post('/send-tier', authenticate, requireAdmin, validate(schemas.sendTierNotification), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, body, data, tier } = req.body;

    // Get user IDs with the specified tier
    const subscriptions = await prisma.subscription.findMany({
      where: { tier: tier.toUpperCase(), status: 'ACTIVE' },
      select: { userId: true },
    });

    const userIds = subscriptions.map((s) => s.userId);

    const tokens = await prisma.deviceToken.findMany({
      where: { userId: { in: userIds }, isActive: true },
      select: { token: true },
    });

    if (tokens.length === 0) {
      sendSuccess(res, { sent: 0 }, 'No devices to notify');
      return;
    }

    const message: admin.messaging.MulticastMessage = {
      tokens: tokens.map((t) => t.token),
      notification: { title, body },
      data: data || undefined,
    };

    const result = await admin.messaging().sendEachForMulticast(message);

    sendSuccess(res, {
      sent: result.successCount,
      failed: result.failureCount,
      tier,
    });
  } catch (error) {
    sendError(res, 'Failed to send notifications', 500);
  }
});

export default router;
