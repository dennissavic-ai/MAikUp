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
  lookData: { products: ['prod-1'] },
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSharedLook = {
  id: 'shared-1',
  savedLookId: 'look-1',
  userId: 'user-1',
  shareCode: 'abc123xy',
  isPublic: true,
  viewCount: 5,
  createdAt: new Date(),
  savedLook: mockSavedLook,
  user: { displayName: 'Test User', photoUrl: null },
};

beforeEach(() => {
  jest.clearAllMocks();
  (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({
    uid: 'firebase-1',
    email: 'test@test.com',
  });
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
});

describe('POST /api/sharing/:savedLookId', () => {
  it('shares a saved look and returns share code', async () => {
    (prisma.savedLook.findFirst as jest.Mock).mockResolvedValue(mockSavedLook);
    (prisma.sharedLook.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.sharedLook.create as jest.Mock).mockResolvedValue({
      id: 'shared-new',
      shareCode: 'newcode1',
    });

    const res = await request(app)
      .post('/api/sharing/look-1')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.shareCode).toBeDefined();
    expect(res.body.data.shareUrl).toBeDefined();
    expect(res.body.message).toBe('Look shared successfully');
  });

  it('returns existing share code if already shared', async () => {
    (prisma.savedLook.findFirst as jest.Mock).mockResolvedValue(mockSavedLook);
    (prisma.sharedLook.findFirst as jest.Mock).mockResolvedValue({
      shareCode: 'existing1',
    });

    const res = await request(app)
      .post('/api/sharing/look-1')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.data.shareCode).toBe('existing1');
    expect(res.body.data.shareUrl).toBe('/shared/existing1');
  });

  it('returns 404 when look not found', async () => {
    (prisma.savedLook.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post('/api/sharing/nonexistent')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Look not found');
  });
});

describe('GET /api/sharing/view/:shareCode', () => {
  it('returns a shared look without auth (public)', async () => {
    (prisma.sharedLook.findUnique as jest.Mock).mockResolvedValue(mockSharedLook);
    (prisma.sharedLook.update as jest.Mock).mockResolvedValue(mockSharedLook);

    const res = await request(app).get('/api/sharing/view/abc123xy');

    expect(res.status).toBe(200);
    expect(res.body.data.look).toBeDefined();
    expect(res.body.data.sharedBy).toBeDefined();
    expect(res.body.data.viewCount).toBe(6);
  });

  it('returns 404 when share code not found', async () => {
    (prisma.sharedLook.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/sharing/view/badcode');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Shared look not found');
  });

  it('returns 404 when shared look is not public', async () => {
    (prisma.sharedLook.findUnique as jest.Mock).mockResolvedValue({
      ...mockSharedLook,
      isPublic: false,
    });

    const res = await request(app).get('/api/sharing/view/abc123xy');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Shared look not found');
  });
});

describe('DELETE /api/sharing/:savedLookId', () => {
  it('unshares a look', async () => {
    (prisma.sharedLook.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

    const res = await request(app)
      .delete('/api/sharing/look-1')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Look unshared');
  });
});

describe('GET /api/sharing', () => {
  it('returns list of shared looks for authenticated user', async () => {
    (prisma.sharedLook.findMany as jest.Mock).mockResolvedValue([
      { ...mockSharedLook, savedLook: mockSavedLook },
    ]);

    const res = await request(app)
      .get('/api/sharing')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/sharing');

    expect(res.status).toBe(401);
  });
});
