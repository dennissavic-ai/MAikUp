import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { generateUploadUrl, getPublicUrl } from '../config/s3';
import crypto from 'crypto';

const router = Router();

// Generate a presigned upload URL for product/hairstyle images (admin only)
router.post('/presign', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentType, folder } = req.body;

    if (!contentType || !folder) {
      sendError(res, 'contentType and folder are required');
      return;
    }

    const allowedFolders = ['products', 'hairstyles', 'looks', 'user-looks'];
    if (!allowedFolders.includes(folder)) {
      sendError(res, `folder must be one of: ${allowedFolders.join(', ')}`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      sendError(res, `contentType must be one of: ${allowedTypes.join(', ')}`);
      return;
    }

    const ext = contentType.split('/')[1];
    const key = `${folder}/${crypto.randomUUID()}.${ext}`;
    const uploadUrl = await generateUploadUrl(key, contentType);
    const publicUrl = getPublicUrl(key);

    sendSuccess(res, { uploadUrl, publicUrl, key });
  } catch (error) {
    sendError(res, 'Failed to generate upload URL', 500);
  }
});

// Generate a presigned upload URL for user-generated content (authenticated users)
router.post('/user-upload', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentType } = req.body;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!contentType || !allowedTypes.includes(contentType)) {
      sendError(res, `contentType must be one of: ${allowedTypes.join(', ')}`);
      return;
    }

    const ext = contentType.split('/')[1];
    const key = `user-looks/${req.user!.userId}/${crypto.randomUUID()}.${ext}`;
    const uploadUrl = await generateUploadUrl(key, contentType);
    const publicUrl = getPublicUrl(key);

    sendSuccess(res, { uploadUrl, publicUrl, key });
  } catch (error) {
    sendError(res, 'Failed to generate upload URL', 500);
  }
});

export default router;
