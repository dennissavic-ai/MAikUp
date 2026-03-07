import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { validate } from '../middleware/validate';
import * as schemas from '../validation/schemas';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { generateUploadUrl, getPublicUrl } from '../config/s3';
import crypto from 'crypto';

const router = Router();

// Generate a presigned upload URL for product/hairstyle images (admin only)
router.post('/presign', authenticate, requireAdmin, validate(schemas.presignUpload), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentType, folder } = req.body;

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
router.post('/user-upload', authenticate, validate(schemas.userUpload), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contentType } = req.body;

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
