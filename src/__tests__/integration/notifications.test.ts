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

describe('POST /api/notifications/register', () => {
  it('registers a device token', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.deviceToken.upsert as jest.Mock).mockResolvedValue({
      id: 'dt-1',
      token: 'device-token-123',
      platform: 'ios',
    });

    const res = await request(app)
      .post('/api/notifications/register')
      .set('Authorization', 'Bearer test-token')
      .send({ token: 'device-token-123', platform: 'ios' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Device registered for notifications');
  });

  it('returns 400 when token or platform missing', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/notifications/register')
      .set('Authorization', 'Bearer test-token')
      .send({ token: 'device-token-123' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid platform', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/notifications/register')
      .set('Authorization', 'Bearer test-token')
      .send({ token: 'device-token-123', platform: 'windows' });

    expect(res.status).toBe(400);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app)
      .post('/api/notifications/register')
      .send({ token: 'device-token-123', platform: 'ios' });

    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/notifications/unregister', () => {
  it('unregisters a device token', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.deviceToken.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

    const res = await request(app)
      .delete('/api/notifications/unregister')
      .set('Authorization', 'Bearer test-token')
      .send({ token: 'device-token-123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Device unregistered');
  });

  it('returns 400 when token missing', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .delete('/api/notifications/unregister')
      .set('Authorization', 'Bearer test-token')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('POST /api/notifications/send-all', () => {
  it('sends notification to all devices for admin', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
    (prisma.deviceToken.findMany as jest.Mock).mockResolvedValue([
      { token: 'tok-1' },
      { token: 'tok-2' },
    ]);

    const res = await request(app)
      .post('/api/notifications/send-all')
      .set('Authorization', 'Bearer test-token')
      .send({ title: 'New Feature!', body: 'Check out our latest update' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sent).toBe(1);
    expect(res.body.data.totalDevices).toBe(2);
  });

  it('returns 400 when title or body missing', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);

    const res = await request(app)
      .post('/api/notifications/send-all')
      .set('Authorization', 'Bearer test-token')
      .send({ title: 'Only Title' });

    expect(res.status).toBe(400);
  });

  it('handles no devices gracefully', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
    (prisma.deviceToken.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app)
      .post('/api/notifications/send-all')
      .set('Authorization', 'Bearer test-token')
      .send({ title: 'Test', body: 'No devices' });

    expect(res.status).toBe(200);
    expect(res.body.data.sent).toBe(0);
    expect(res.body.message).toBe('No devices to notify');
  });

  it('returns 403 for non-admin user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/notifications/send-all')
      .set('Authorization', 'Bearer test-token')
      .send({ title: 'Test', body: 'Test body' });

    expect(res.status).toBe(403);
  });
});

describe('POST /api/notifications/send-tier', () => {
  it('sends notification to specific tier for admin', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
    (prisma.subscription.findMany as jest.Mock).mockResolvedValue([
      { userId: 'user-1' },
      { userId: 'user-2' },
    ]);
    (prisma.deviceToken.findMany as jest.Mock).mockResolvedValue([
      { token: 'tok-1' },
    ]);

    const res = await request(app)
      .post('/api/notifications/send-tier')
      .set('Authorization', 'Bearer test-token')
      .send({ title: 'Premium Feature', body: 'Exclusive update', tier: 'PREMIUM' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sent).toBe(1);
    expect(res.body.data.tier).toBe('PREMIUM');
  });

  it('returns 400 when tier missing', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);

    const res = await request(app)
      .post('/api/notifications/send-tier')
      .set('Authorization', 'Bearer test-token')
      .send({ title: 'Test', body: 'Test body' });

    expect(res.status).toBe(400);
  });
});
