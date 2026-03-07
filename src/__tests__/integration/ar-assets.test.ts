import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

require('../setup');

const mockAsset = {
  id: 'ar-1',
  productId: 'prod-1',
  hairstyleId: null,
  assetType: 'MAKEUP_OVERLAY',
  modelUrl: 'https://s3.example.com/models/lips-red.glb',
  textureUrl: 'https://s3.example.com/textures/lips-red.png',
  thumbnailUrl: null,
  anchorPoint: 'lips',
  blendMode: 'multiply',
  opacity: 0.8,
  scale: { x: 1.0, y: 1.0, z: 1.0 },
  offset: { x: 0, y: 0, z: 0 },
  metadata: null,
  version: 1,
  fileSizeBytes: 245000,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GET /api/ar/product/:productId', () => {
  it('returns AR assets for a product', async () => {
    (prisma.arAsset.findMany as jest.Mock).mockResolvedValue([mockAsset]);

    const res = await request(app).get('/api/ar/product/prod-1');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].assetType).toBe('MAKEUP_OVERLAY');
    expect(res.body.data[0].anchorPoint).toBe('lips');
    expect(res.body.data[0].blendMode).toBe('multiply');
  });

  it('returns 404 when no assets exist', async () => {
    (prisma.arAsset.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get('/api/ar/product/prod-999');

    expect(res.status).toBe(404);
  });
});

describe('POST /api/ar/batch', () => {
  it('returns grouped assets for multiple products', async () => {
    (prisma.arAsset.findMany as jest.Mock).mockResolvedValue([
      { ...mockAsset, id: 'ar-1', productId: 'prod-1' },
      { ...mockAsset, id: 'ar-2', productId: 'prod-2', anchorPoint: 'left_eye' },
    ]);

    const res = await request(app)
      .post('/api/ar/batch')
      .send({ productIds: ['prod-1', 'prod-2'] });

    expect(res.status).toBe(200);
    expect(res.body.data['prod-1']).toBeDefined();
    expect(res.body.data['prod-2']).toBeDefined();
  });

  it('requires at least one ID array', async () => {
    const res = await request(app)
      .post('/api/ar/batch')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('GET /api/ar/manifest', () => {
  it('returns lightweight asset manifest', async () => {
    (prisma.arAsset.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'ar-1',
        productId: 'prod-1',
        hairstyleId: null,
        assetType: 'MAKEUP_OVERLAY',
        version: 1,
        fileSizeBytes: 245000,
        updatedAt: new Date(),
      },
    ]);

    const res = await request(app).get('/api/ar/manifest');

    expect(res.status).toBe(200);
    expect(res.body.data.count).toBe(1);
    expect(res.body.data.totalSizeBytes).toBe(245000);
    expect(res.body.data.assets).toHaveLength(1);
  });

  it('filters by since parameter', async () => {
    (prisma.arAsset.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get('/api/ar/manifest?since=2026-01-01');

    expect(res.status).toBe(200);
    expect(res.body.data.count).toBe(0);
  });
});
