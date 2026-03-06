import { Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../types';
import { sendError } from '../utils/response';

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Missing or invalid authorization header', 401);
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || '',
          displayName: decodedToken.name || null,
          photoUrl: decodedToken.picture || null,
          subscription: {
            create: {
              tier: 'FREE',
              status: 'ACTIVE',
            },
          },
        },
      });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      userId: user.id,
    };

    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (user) {
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        userId: user.id,
      };
    }
  } catch {
    // Token invalid, continue without auth
  }

  next();
}
