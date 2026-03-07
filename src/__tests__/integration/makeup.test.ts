import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

require('../setup');

const mockProducts = [
  {
    id: 'prod-1',
    category: 'LIPS',
    subcategory: 'lipstick',
    name: 'Classic Red Lipstick',
    description: 'Timeless true red',
    colorHex: '#FF0000',
    colorName: 'Classic Red',
    finish: 'satin',
    intensity: 'full',
    imageUrl: null,
    thumbnailUrl: null,
    tier: 'FREE',
    isActive: true,
    sortOrder: 1,
    tags: ['red', 'classic'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-2',
    category: 'EYES',
    subcategory: 'eyeshadow',
    name: 'Champagne Toast Shadow',
    description: 'Shimmering champagne',
    colorHex: '#F5DEB3',
    colorName: 'Champagne Toast',
    finish: 'shimmer',
    intensity: 'medium',
    imageUrl: null,
    thumbnailUrl: null,
    tier: 'FREE',
    isActive: true,
    sortOrder: 2,
    tags: ['champagne', 'shimmer'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('GET /api/makeup/products', () => {
  it('returns paginated products', async () => {
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue(mockProducts);
    (prisma.makeupProduct.count as jest.Mock).mockResolvedValue(2);

    const res = await request(app).get('/api/makeup/products');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBe(2);
  });

  it('filters by category', async () => {
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue([mockProducts[0]]);
    (prisma.makeupProduct.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/api/makeup/products?category=LIPS');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe('LIPS');
  });

  it('filters by subcategory', async () => {
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue([mockProducts[0]]);
    (prisma.makeupProduct.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/api/makeup/products?subcategory=lipstick');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('searches by name', async () => {
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue([mockProducts[0]]);
    (prisma.makeupProduct.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app).get('/api/makeup/products?search=red');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('respects pagination params', async () => {
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.makeupProduct.count as jest.Mock).mockResolvedValue(50);

    const res = await request(app).get('/api/makeup/products?page=2&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.limit).toBe(10);
    expect(res.body.pagination.totalPages).toBe(5);
  });
});

describe('GET /api/makeup/products/:id', () => {
  it('returns a single product', async () => {
    (prisma.makeupProduct.findUnique as jest.Mock).mockResolvedValue(mockProducts[0]);

    const res = await request(app).get('/api/makeup/products/prod-1');

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Classic Red Lipstick');
  });

  it('returns 404 for non-existent product', async () => {
    (prisma.makeupProduct.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/makeup/products/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Product not found');
  });
});

describe('GET /api/makeup/categories', () => {
  it('returns grouped categories', async () => {
    (prisma.makeupProduct.groupBy as jest.Mock).mockResolvedValue([
      { category: 'LIPS', subcategory: 'lipstick', _count: { id: 10 } },
      { category: 'LIPS', subcategory: 'lip_gloss', _count: { id: 5 } },
      { category: 'EYES', subcategory: 'eyeshadow', _count: { id: 20 } },
    ]);

    const res = await request(app).get('/api/makeup/categories');

    expect(res.status).toBe(200);
    expect(res.body.data.LIPS).toHaveLength(2);
    expect(res.body.data.EYES).toHaveLength(1);
  });
});
