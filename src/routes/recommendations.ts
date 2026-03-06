import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authenticate, optionalAuth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

// Get personalized product recommendations based on user's skin tone
router.get('/for-me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { skinTone: true, skinUndertone: true },
    });

    if (!user?.skinTone || !user?.skinUndertone) {
      sendError(res, 'Please set your skin tone and undertone in your profile first', 400);
      return;
    }

    const category = req.query.category as string;

    const recommendations = await prisma.skinToneRecommendation.findMany({
      where: {
        skinTone: user.skinTone,
        skinUndertone: user.skinUndertone,
      },
      orderBy: { matchScore: 'desc' },
    });

    // Fetch the actual products
    const productIds = recommendations.map((r) => r.productId);
    const products = await prisma.makeupProduct.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
        ...(category ? { category: category.toUpperCase() as any } : {}),
      },
    });

    // Merge match scores with products
    const scored = products.map((product) => {
      const rec = recommendations.find((r) => r.productId === product.id);
      return {
        ...product,
        matchScore: rec?.matchScore ?? 0,
        matchNotes: rec?.notes ?? null,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    sendSuccess(res, {
      skinTone: user.skinTone,
      skinUndertone: user.skinUndertone,
      recommendations: scored,
    });
  } catch (error) {
    sendError(res, 'Failed to fetch recommendations', 500);
  }
});

// Get recommendations for a specific skin tone (no auth required - for browsing)
router.get('/by-skin-tone', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { skinTone, skinUndertone, category } = req.query;

    if (!skinTone || !skinUndertone) {
      sendError(res, 'skinTone and skinUndertone query parameters are required');
      return;
    }

    const recommendations = await prisma.skinToneRecommendation.findMany({
      where: {
        skinTone: skinTone as string,
        skinUndertone: skinUndertone as string,
      },
      orderBy: { matchScore: 'desc' },
    });

    const productIds = recommendations.map((r) => r.productId);
    const products = await prisma.makeupProduct.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
        ...(category ? { category: (category as string).toUpperCase() as any } : {}),
      },
    });

    const scored = products.map((product) => {
      const rec = recommendations.find((r) => r.productId === product.id);
      return {
        ...product,
        matchScore: rec?.matchScore ?? 0,
        matchNotes: rec?.notes ?? null,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    sendSuccess(res, scored);
  } catch (error) {
    sendError(res, 'Failed to fetch recommendations', 500);
  }
});

// Get available skin tones and undertones (for profile setup)
router.get('/skin-tones', (_req: any, res: Response) => {
  sendSuccess(res, {
    skinTones: [
      { value: 'very_fair', label: 'Very Fair', description: 'Porcelain, ivory, very pale complexion' },
      { value: 'fair', label: 'Fair', description: 'Light skin, may burn easily' },
      { value: 'light', label: 'Light', description: 'Light with some warmth, tans gradually' },
      { value: 'light_medium', label: 'Light Medium', description: 'Between light and medium' },
      { value: 'medium', label: 'Medium', description: 'Moderate tone, tans well' },
      { value: 'medium_tan', label: 'Medium Tan', description: 'Warm medium, golden tones' },
      { value: 'olive', label: 'Olive', description: 'Greenish or golden-yellow undertones' },
      { value: 'tan', label: 'Tan', description: 'Warm bronze tones' },
      { value: 'deep', label: 'Deep', description: 'Rich, dark skin tones' },
      { value: 'very_deep', label: 'Very Deep', description: 'Very rich, deep complexion' },
    ],
    undertones: [
      { value: 'warm', label: 'Warm', description: 'Yellow, golden, or peachy undertones. Veins appear green.' },
      { value: 'cool', label: 'Cool', description: 'Pink, red, or bluish undertones. Veins appear blue/purple.' },
      { value: 'neutral', label: 'Neutral', description: 'Mix of warm and cool. Veins appear blue-green.' },
    ],
    faceShapes: [
      { value: 'oval', label: 'Oval' },
      { value: 'round', label: 'Round' },
      { value: 'square', label: 'Square' },
      { value: 'heart', label: 'Heart' },
      { value: 'oblong', label: 'Oblong' },
      { value: 'diamond', label: 'Diamond' },
    ],
  });
});

export default router;
