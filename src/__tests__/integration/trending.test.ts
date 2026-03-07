import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

require('../setup');

describe('GET /api/trending', () => {
  it('returns featured items grouped by section', async () => {
    (prisma.featuredItem.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'f1',
        type: 'PRODUCT',
        entityId: 'prod-1',
        title: 'Trending Red',
        subtitle: null,
        imageUrl: null,
        position: 0,
        section: 'trending',
        startDate: null,
        endDate: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'f2',
        type: 'LOOK',
        entityId: 'look-1',
        title: 'Editor Pick',
        subtitle: null,
        imageUrl: null,
        position: 0,
        section: 'editors_pick',
        startDate: null,
        endDate: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const res = await request(app).get('/api/trending');

    expect(res.status).toBe(200);
    expect(res.body.data.trending).toHaveLength(1);
    expect(res.body.data.editors_pick).toHaveLength(1);
  });

  it('filters by section', async () => {
    (prisma.featuredItem.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'f1',
        type: 'PRODUCT',
        entityId: 'prod-1',
        title: 'Trending Red',
        section: 'trending',
        position: 0,
        isActive: true,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const res = await request(app).get('/api/trending?section=trending');

    expect(res.status).toBe(200);
    expect(res.body.data.trending).toBeDefined();
  });
});

describe('GET /api/trending/auto', () => {
  it('returns auto-generated trending from analytics', async () => {
    (prisma.analyticsEvent.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.makeupLook.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.hairstyle.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get('/api/trending/auto');

    expect(res.status).toBe(200);
    expect(res.body.data.period).toBe('7 days');
    expect(res.body.data.trending).toBeDefined();
    expect(res.body.data.trending.products).toBeDefined();
    expect(res.body.data.trending.looks).toBeDefined();
    expect(res.body.data.trending.hairstyles).toBeDefined();
  });
});
