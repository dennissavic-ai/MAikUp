import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

require('../setup');

const mockHairstyles = [
  {
    id: 'hs-1',
    category: 'CUT',
    subcategory: 'bob',
    name: 'Classic Bob',
    description: 'Clean chin-length bob',
    length: 'short',
    texture: 'straight',
    colorHex: null,
    colorName: null,
    imageUrl: null,
    thumbnailUrl: null,
    tier: 'FREE',
    isActive: true,
    sortOrder: 1,
    tags: ['bob', 'classic'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('GET /api/hairstyles', () => {
  it('returns paginated hairstyles', async () => {
    (prisma.hairstyle.findMany as jest.Mock).mockResolvedValue(mockHairstyles);
    (prisma.hairstyle.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/api/hairstyles');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Classic Bob');
  });

  it('filters by category', async () => {
    (prisma.hairstyle.findMany as jest.Mock).mockResolvedValue(mockHairstyles);
    (prisma.hairstyle.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/api/hairstyles?category=CUT');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('filters by length', async () => {
    (prisma.hairstyle.findMany as jest.Mock).mockResolvedValue(mockHairstyles);
    (prisma.hairstyle.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/api/hairstyles?length=short');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('filters by texture', async () => {
    (prisma.hairstyle.findMany as jest.Mock).mockResolvedValue(mockHairstyles);
    (prisma.hairstyle.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/api/hairstyles?texture=straight');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /api/hairstyles/:id', () => {
  it('returns a single hairstyle', async () => {
    (prisma.hairstyle.findUnique as jest.Mock).mockResolvedValue(mockHairstyles[0]);

    const res = await request(app).get('/api/hairstyles/hs-1');

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Classic Bob');
  });

  it('returns 404 for non-existent hairstyle', async () => {
    (prisma.hairstyle.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/hairstyles/nonexistent');

    expect(res.status).toBe(404);
  });
});

describe('GET /api/hairstyles/categories', () => {
  it('returns grouped categories', async () => {
    (prisma.hairstyle.groupBy as jest.Mock).mockResolvedValue([
      { category: 'CUT', subcategory: 'bob', _count: { id: 5 } },
      { category: 'CUT', subcategory: 'pixie', _count: { id: 3 } },
      { category: 'BRAID', subcategory: 'french_braid', _count: { id: 2 } },
    ]);

    const res = await request(app).get('/api/hairstyles/categories');

    expect(res.status).toBe(200);
    expect(res.body.data.CUT).toHaveLength(2);
    expect(res.body.data.BRAID).toHaveLength(1);
  });
});
