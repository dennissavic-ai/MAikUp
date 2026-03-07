import rateLimit from 'express-rate-limit';
import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../types';

// Tier-based rate limits per 15-minute window
const TIER_LIMITS: Record<string, number> = {
  FREE: 60,       // 60 requests per 15 min (4/min)
  BASIC: 200,     // 200 requests per 15 min (~13/min)
  PREMIUM: 500,   // 500 requests per 15 min (~33/min)
  ADMIN: 1000,    // 1000 requests per 15 min
};

// Default rate limiter for unauthenticated requests
export const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Sign up for higher limits.' },
});

// Tiered rate limiter that adjusts based on subscription
export const tieredLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const authReq = req as AuthenticatedRequest;
    return authReq.user?.userId || req.ip || 'unknown';
  },
  max: async (req) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      return TIER_LIMITS.FREE;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: authReq.user.userId },
        select: { role: true, subscription: { select: { tier: true, status: true } } },
      });

      if (user?.role === 'ADMIN') {
        return TIER_LIMITS.ADMIN;
      }

      if (user?.subscription?.status === 'ACTIVE' || user?.subscription?.status === 'TRIALING') {
        return TIER_LIMITS[user.subscription.tier] || TIER_LIMITS.FREE;
      }
    } catch {
      // Fall through to default
    }

    return TIER_LIMITS.FREE;
  },
  message: { success: false, error: 'Rate limit exceeded. Upgrade your plan for higher limits.' },
});

// Strict rate limiter for sensitive endpoints (auth, payment)
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many attempts. Please try again later.' },
});

// Very permissive limiter for read-heavy endpoints (catalog browsing)
export const catalogLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please slow down.' },
});
