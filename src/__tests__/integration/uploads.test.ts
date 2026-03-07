import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';
import { firebaseAuth } from '../../config/firebase';

require('../setup');

const USER_ID = '00000000-0000-4000-8000-000000000001';
const ADMIN_ID = '00000000-0000-4000-8000-000000000002';

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

describe('POST /api/uploads/presign', () => {
  it('generates presigned URL for admin', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);

    const res = await request(app)
      .post('/api/uploads/presign')
      .set('Authorization', 'Bearer test-token')
      .send({ contentType: 'image/jpeg', folder: 'products' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.uploadUrl).toBeDefined();
    expect(res.body.data.publicUrl).toBeDefined();
    expect(res.body.data.key).toBeDefined();
  });

  it('returns 400 for invalid content type', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);

    const res = await request(app)
      .post('/api/uploads/presign')
      .set('Authorization', 'Bearer test-token')
      .send({ contentType: 'application/pdf', folder: 'products' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid folder', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);

    const res = await request(app)
      .post('/api/uploads/presign')
      .set('Authorization', 'Bearer test-token')
      .send({ contentType: 'image/png', folder: 'invalid-folder' });

    expect(res.status).toBe(400);
  });

  it('returns 403 for non-admin user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/uploads/presign')
      .set('Authorization', 'Bearer test-token')
      .send({ contentType: 'image/jpeg', folder: 'products' });

    expect(res.status).toBe(403);
  });
});

describe('POST /api/uploads/user-upload', () => {
  it('generates upload URL for authenticated user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/uploads/user-upload')
      .set('Authorization', 'Bearer test-token')
      .send({ contentType: 'image/png' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.uploadUrl).toBeDefined();
    expect(res.body.data.publicUrl).toBeDefined();
    expect(res.body.data.key).toContain('user-looks/');
  });

  it('returns 400 for invalid content type', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/uploads/user-upload')
      .set('Authorization', 'Bearer test-token')
      .send({ contentType: 'video/mp4' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when contentType missing', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/uploads/user-upload')
      .set('Authorization', 'Bearer test-token')
      .send({});

    expect(res.status).toBe(400);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app)
      .post('/api/uploads/user-upload')
      .send({ contentType: 'image/jpeg' });

    expect(res.status).toBe(401);
  });
});
