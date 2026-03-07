import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';
import { firebaseAuth } from '../../config/firebase';

require('../setup');

const mockUser = {
  id: 'user-1',
  firebaseUid: 'firebase-1',
  email: 'test@test.com',
  displayName: 'Test User',
  photoUrl: null,
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSavedLook = {
  id: 'look-1',
  userId: 'user-1',
  name: 'Date Night',
  lookData: { products: ['prod-1', 'prod-2'] },
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHistory = {
  id: 'hist-1',
  userId: 'user-1',
  lookData: { products: ['prod-1'] },
  createdAt: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({
    uid: 'firebase-1',
    email: 'test@test.com',
  });
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
});

describe('GET /api/looks', () => {
  it('returns paginated saved looks', async () => {
    (prisma.savedLook.findMany as jest.Mock).mockResolvedValue([mockSavedLook]);
    (prisma.savedLook.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app)
      .get('/api/looks')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBe(1);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/looks');

    expect(res.status).toBe(401);
  });
});

describe('POST /api/looks', () => {
  it('saves a new look', async () => {
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue({
      tier: 'FREE',
      status: 'ACTIVE',
    });
    (prisma.savedLook.count as jest.Mock).mockResolvedValue(0);
    (prisma.savedLook.create as jest.Mock).mockResolvedValue(mockSavedLook);

    const res = await request(app)
      .post('/api/looks')
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'Date Night', lookData: { products: ['prod-1', 'prod-2'] } });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Look saved successfully');
  });

  it('returns 400 when name or lookData missing', async () => {
    const res = await request(app)
      .post('/api/looks')
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'Missing Data' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('name and lookData are required');
  });

  it('returns 403 when tier limit reached', async () => {
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue({
      tier: 'FREE',
      status: 'ACTIVE',
    });
    (prisma.savedLook.count as jest.Mock).mockResolvedValue(5);

    const res = await request(app)
      .post('/api/looks')
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'Over Limit', lookData: { products: ['prod-1'] } });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('maximum');
  });
});

describe('PATCH /api/looks/:id', () => {
  it('updates a saved look', async () => {
    (prisma.savedLook.findFirst as jest.Mock).mockResolvedValue(mockSavedLook);
    (prisma.savedLook.update as jest.Mock).mockResolvedValue({
      ...mockSavedLook,
      name: 'Updated Name',
    });

    const res = await request(app)
      .patch('/api/looks/look-1')
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Look updated successfully');
  });

  it('returns 404 when look not found', async () => {
    (prisma.savedLook.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .patch('/api/looks/nonexistent')
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'No Such Look' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Look not found');
  });
});

describe('DELETE /api/looks/:id', () => {
  it('deletes a saved look', async () => {
    (prisma.savedLook.findFirst as jest.Mock).mockResolvedValue(mockSavedLook);
    (prisma.savedLook.delete as jest.Mock).mockResolvedValue(mockSavedLook);

    const res = await request(app)
      .delete('/api/looks/look-1')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Look deleted successfully');
  });

  it('returns 404 when look not found', async () => {
    (prisma.savedLook.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/looks/nonexistent')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Look not found');
  });
});

describe('POST /api/looks/history', () => {
  it('records look history', async () => {
    (prisma.lookHistory.create as jest.Mock).mockResolvedValue(mockHistory);

    const res = await request(app)
      .post('/api/looks/history')
      .set('Authorization', 'Bearer test-token')
      .send({ lookData: { products: ['prod-1'] } });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Look recorded in history');
  });

  it('returns 400 when lookData missing', async () => {
    const res = await request(app)
      .post('/api/looks/history')
      .set('Authorization', 'Bearer test-token')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('lookData is required');
  });
});

describe('GET /api/looks/history', () => {
  it('returns paginated look history', async () => {
    (prisma.lookHistory.findMany as jest.Mock).mockResolvedValue([mockHistory]);
    (prisma.lookHistory.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app)
      .get('/api/looks/history')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toBeDefined();
  });
});
