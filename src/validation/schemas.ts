import { z } from 'zod';

// ─── AR Assets ──────────────────────────────────────────────

export const createArAsset = z.object({
  assetType: z.enum(['MAKEUP_OVERLAY', 'FACE_MESH', 'HAIR_MODEL', 'ACCESSORY_MODEL'], {
    message: 'assetType must be MAKEUP_OVERLAY, FACE_MESH, HAIR_MODEL, or ACCESSORY_MODEL',
  }),
  modelUrl: z.string().url({ message: 'modelUrl must be a valid URL' }),
  productId: z.string().uuid({ message: 'productId must be a valid UUID' }).optional(),
  hairstyleId: z.string().uuid({ message: 'hairstyleId must be a valid UUID' }).optional(),
  textureUrl: z.string().url({ message: 'textureUrl must be a valid URL' }).optional(),
  thumbnailUrl: z.string().url({ message: 'thumbnailUrl must be a valid URL' }).optional(),
  anchorPoint: z.string().optional(),
  blendMode: z.enum(['multiply', 'overlay', 'screen', 'normal']).optional(),
  opacity: z.number().min(0).max(1).optional(),
  scale: z.record(z.string(), z.number()).optional(),
  offset: z.record(z.string(), z.number()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  version: z.number().int().positive().optional(),
  fileSizeBytes: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export const updateArAsset = z.object({
  assetType: z.enum(['MAKEUP_OVERLAY', 'FACE_MESH', 'HAIR_MODEL', 'ACCESSORY_MODEL']).optional(),
  modelUrl: z.string().url().optional(),
  productId: z.string().uuid().nullable().optional(),
  hairstyleId: z.string().uuid().nullable().optional(),
  textureUrl: z.string().url().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  anchorPoint: z.string().nullable().optional(),
  blendMode: z.enum(['multiply', 'overlay', 'screen', 'normal']).nullable().optional(),
  opacity: z.number().min(0).max(1).optional(),
  scale: z.record(z.string(), z.number()).nullable().optional(),
  offset: z.record(z.string(), z.number()).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  version: z.number().int().positive().optional(),
  fileSizeBytes: z.number().int().nonnegative().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const batchFetchAssets = z.object({
  productIds: z.array(z.string().uuid({ message: 'Each productId must be a valid UUID' })).optional(),
  hairstyleIds: z.array(z.string().uuid({ message: 'Each hairstyleId must be a valid UUID' })).optional(),
}).refine(
  (data) => (data.productIds && data.productIds.length > 0) || (data.hairstyleIds && data.hairstyleIds.length > 0),
  { message: 'Provide productIds and/or hairstyleIds arrays' }
);

// ─── Trending / Featured ────────────────────────────────────

export const createFeaturedItem = z.object({
  type: z.enum(['PRODUCT', 'LOOK', 'HAIRSTYLE', 'COLLECTION'], {
    message: 'type must be PRODUCT, LOOK, HAIRSTYLE, or COLLECTION',
  }),
  entityId: z.string().uuid({ message: 'entityId must be a valid UUID' }),
  title: z.string().min(1, { message: 'title is required' }),
  subtitle: z.string().optional(),
  imageUrl: z.string().url().optional(),
  position: z.number().int().nonnegative().optional(),
  section: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});

export const updateFeaturedItem = z.object({
  type: z.enum(['PRODUCT', 'LOOK', 'HAIRSTYLE', 'COLLECTION']).optional(),
  entityId: z.string().uuid().optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  position: z.number().int().nonnegative().optional(),
  section: z.string().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const reorderItems = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid({ message: 'Each item id must be a valid UUID' }),
      position: z.number().int({ message: 'position must be an integer' }),
    })
  ).min(1, { message: 'items array is required and must not be empty' }),
});

// ─── Looks ──────────────────────────────────────────────────

export const saveLook = z.object({
  name: z.string().min(1, { message: 'name is required' }),
  lookData: z.record(z.string(), z.unknown(), { message: 'lookData is required' }),
  imageUrl: z.string().url().optional(),
});

export const updateLook = z.object({
  name: z.string().min(1).optional(),
  lookData: z.record(z.string(), z.unknown()).optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export const recordHistory = z.object({
  lookData: z.record(z.string(), z.unknown(), { message: 'lookData is required' }),
});

// ─── Favorites ──────────────────────────────────────────────

export const favoriteProductParams = z.object({
  productId: z.string().uuid({ message: 'productId must be a valid UUID' }),
});

export const favoriteHairstyleParams = z.object({
  hairstyleId: z.string().uuid({ message: 'hairstyleId must be a valid UUID' }),
});

// ─── Analytics ──────────────────────────────────────────────

export const trackEvent = z.object({
  eventType: z.string().min(1, { message: 'eventType is required' }),
  entityId: z.string().uuid().optional(),
  entityType: z.enum(['makeup_product', 'makeup_look', 'hairstyle']).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// ─── Notifications ──────────────────────────────────────────

export const registerDevice = z.object({
  token: z.string().min(1, { message: 'token is required' }),
  platform: z.enum(['android', 'ios'], { message: 'platform must be "android" or "ios"' }),
});

export const unregisterDevice = z.object({
  token: z.string().min(1, { message: 'token is required' }),
});

export const sendNotification = z.object({
  title: z.string().min(1, { message: 'title is required' }),
  body: z.string().min(1, { message: 'body is required' }),
  data: z.record(z.string(), z.string()).optional(),
  platform: z.enum(['android', 'ios']).optional(),
});

export const sendTierNotification = z.object({
  title: z.string().min(1, { message: 'title is required' }),
  body: z.string().min(1, { message: 'body is required' }),
  tier: z.string().min(1, { message: 'tier is required' }),
  data: z.record(z.string(), z.string()).optional(),
});

// ─── Uploads ────────────────────────────────────────────────

export const presignUpload = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'contentType must be one of: image/jpeg, image/png, image/webp',
  }),
  folder: z.enum(['products', 'hairstyles', 'looks', 'user-looks'], {
    message: 'folder must be one of: products, hairstyles, looks, user-looks',
  }),
});

export const userUpload = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'contentType must be one of: image/jpeg, image/png, image/webp',
  }),
});

// ─── Admin ──────────────────────────────────────────────────

export const createProduct = z.object({
  category: z.enum(['FACE', 'EYES', 'LIPS', 'CHEEKS', 'BROWS'], {
    message: 'category must be FACE, EYES, LIPS, CHEEKS, or BROWS',
  }),
  subcategory: z.string().min(1, { message: 'subcategory is required' }),
  name: z.string().min(1, { message: 'name is required' }),
  description: z.string().optional(),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: 'colorHex must be a valid hex color' }).optional(),
  colorName: z.string().optional(),
  finish: z.string().optional(),
  intensity: z.string().optional(),
  imageUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  tier: z.enum(['FREE', 'BASIC', 'PREMIUM']).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProduct = z.object({
  category: z.enum(['FACE', 'EYES', 'LIPS', 'CHEEKS', 'BROWS']).optional(),
  subcategory: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
  colorName: z.string().nullable().optional(),
  finish: z.string().nullable().optional(),
  intensity: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  tier: z.enum(['FREE', 'BASIC', 'PREMIUM']).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
});

export const createHairstyle = z.object({
  category: z.enum(['CUT', 'UPDO', 'BRAID', 'COLOR', 'ACCESSORY'], {
    message: 'category must be CUT, UPDO, BRAID, COLOR, or ACCESSORY',
  }),
  subcategory: z.string().min(1, { message: 'subcategory is required' }),
  name: z.string().min(1, { message: 'name is required' }),
  description: z.string().optional(),
  length: z.string().optional(),
  texture: z.string().optional(),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  colorName: z.string().optional(),
  imageUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  tier: z.enum(['FREE', 'BASIC', 'PREMIUM']).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
});

export const createAdminLook = z.object({
  name: z.string().min(1, { message: 'name is required' }),
  style: z.string().min(1, { message: 'style is required' }),
  description: z.string().optional(),
  occasion: z.string().optional(),
  difficulty: z.string().optional(),
  imageUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  tier: z.enum(['FREE', 'BASIC', 'PREMIUM']).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
  productIds: z.array(z.string().uuid()).optional(),
});

export const updateUserRole = z.object({
  role: z.enum(['USER', 'ADMIN'], { message: 'role must be USER or ADMIN' }),
});

// ─── Search ─────────────────────────────────────────────────

export const searchQuery = z.object({
  q: z.string().min(2, { message: 'Search query must be at least 2 characters' }),
  type: z.enum(['all', 'makeup', 'hairstyles', 'looks']).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

export const suggestQuery = z.object({
  q: z.string().min(1, { message: 'Search query must be at least 1 character' }),
});

// ─── Sharing ────────────────────────────────────────────────

export const savedLookIdParams = z.object({
  savedLookId: z.string().uuid({ message: 'savedLookId must be a valid UUID' }),
});

export const shareCodeParams = z.object({
  shareCode: z.string().min(1, { message: 'shareCode is required' }),
});
