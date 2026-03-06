import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../types';
import { sendError } from '../utils/response';
import { SubscriptionTier } from '@prisma/client';

const TIER_LEVELS: Record<SubscriptionTier, number> = {
  FREE: 0,
  BASIC: 1,
  PREMIUM: 2,
};

export function requireTier(minimumTier: SubscriptionTier) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.userId },
    });

    if (!subscription) {
      sendError(res, 'No subscription found', 403);
      return;
    }

    if (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING') {
      sendError(res, 'Subscription is not active', 403);
      return;
    }

    if (TIER_LEVELS[subscription.tier] < TIER_LEVELS[minimumTier]) {
      sendError(res, `This feature requires a ${minimumTier} subscription or higher`, 403);
      return;
    }

    next();
  };
}
