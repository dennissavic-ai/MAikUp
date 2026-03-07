import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';
import { firebaseAuth } from '../../config/firebase';

require('../setup');

const USER_ID = '00000000-0000-4000-8000-000000000001';
const ADMIN_ID = '00000000-0000-4000-8000-000000000002';
const PRODUCT_ID = '00000000-0000-4000-8000-000000000010';
const LOOK_ID = '00000000-0000-4000-8000-000000000030';

const mockUser = {
  id: USER_ID,
  firebaseUid: 'firebase-1',
  email: 'test@test.com',
  displayName: 'Test User',
  photoUrl: null,
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAdminUser = {
  ...mockUser,
  id: ADMIN_ID,
  role: 'ADMIN',
};

beforeEach(() => {
  jest.clearAllMocks();
  (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({
    uid: 'firebase-1',
    email: 'test@test.com',
  });
});

describe('POST /api/analytics/track', () => {
  it('tracks an analytics event without auth', async () => {
    (prisma.analyticsEvent.create as jest.Mock).mockResolvedValue({ id: 'evt-1' });

    const res = await request(app)
      .post('/api/analytics/track')
      .send({
        eventType: 'product_view',
        entityId: PRODUCT_ID,
        entityType: 'makeup_product',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Event tracked');
  });

  it('tracks an event with auth', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.analyticsEvent.create as jest.Mock).mockResolvedValue({ id: 'evt-2' });

    const res = await request(app)
      .post('/api/analytics/track')
      .set('Authorization', 'Bearer test-token')
      .send({
        eventType: 'product_try',
        entityId: PRODUCT_ID,
        entityType: 'makeup_product',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('returns 400 when eventType missing', async () => {
    const res = await request(app)
      .post('/api/analytics/track')
      .send({ entityId: PRODUCT_ID });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/analytics/popular/products', () => {
  it('returns popular products for admin', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
    (prisma.analyticsEvent.groupBy as jest.Mock).mockResolvedValue([
      { entityId: PRODUCT_ID, _count: { id: 50 } },
    ]);
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue([
      { id: PRODUCT_ID, name: 'Red Lipstick' },
    ]);

    const res = await request(app)
      .get('/api/analytics/popular/products')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.data.period).toBe('30 days');
    expect(res.body.data.data).toHaveLength(1);
    expect(res.body.data.data[0].viewCount).toBe(50);
  });

  it('returns 403 for non-admin user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .get('/api/analytics/popular/products')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Admin access required');
  });
});

describe('GET /api/analytics/popular/looks', () => {
  it('returns popular looks for admin', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
    (prisma.analyticsEvent.groupBy as jest.Mock).mockResolvedValue([
      { entityId: LOOK_ID, _count: { id: 30 } },
    ]);
    (prisma.makeupLook.findMany as jest.Mock).mockResolvedValue([
      { id: LOOK_ID, name: 'Evening Glam' },
    ]);

    const res = await request(app)
      .get('/api/analytics/popular/looks')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.data.data).toHaveLength(1);
    expect(res.body.data.data[0].viewCount).toBe(30);
  });
});

describe('GET /api/analytics/summary', () => {
  it('returns analytics summary for admin', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
    (prisma.analyticsEvent.groupBy as jest.Mock)
      .mockResolvedValueOnce([
        { eventType: 'product_view', _count: { id: 100 } },
        { eventType: 'product_try', _count: { id: 50 } },
      ])
      .mockResolvedValueOnce([
        { userId: 'user-1' },
        { userId: 'user-2' },
      ]);

    const res = await request(app)
      .get('/api/analytics/summary')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.data.totalEvents).toBe(150);
    expect(res.body.data.uniqueActiveUsers).toBe(2);
    expect(res.body.data.eventBreakdown).toHaveLength(2);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/analytics/summary');

    expect(res.status).toBe(401);
  });
});
