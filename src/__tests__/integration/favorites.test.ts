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

const mockFavorites = [
  {
    id: 'fav-1',
    userId: 'user-1',
    productId: 'prod-1',
    hairstyleId: null,
    createdAt: new Date(),
    product: { id: 'prod-1', name: 'Red Lipstick' },
    hairstyle: null,
  },
  {
    id: 'fav-2',
    userId: 'user-1',
    productId: null,
    hairstyleId: 'hair-1',
    createdAt: new Date(),
    product: null,
    hairstyle: { id: 'hair-1', name: 'Beach Waves' },
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({
    uid: 'firebase-1',
    email: 'test@test.com',
  });
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
});

describe('GET /api/favorites', () => {
  it('returns paginated favorites', async () => {
    (prisma.favorite.findMany as jest.Mock).mockResolvedValue(mockFavorites);
    (prisma.favorite.count as jest.Mock).mockResolvedValue(2);

    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBe(2);
  });

  it('filters by type=makeup', async () => {
    (prisma.favorite.findMany as jest.Mock).mockResolvedValue([mockFavorites[0]]);
    (prisma.favorite.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app)
      .get('/api/favorites?type=makeup')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/favorites');

    expect(res.status).toBe(401);
  });
});

describe('POST /api/favorites/makeup/:productId', () => {
  it('adds a makeup product to favorites', async () => {
    const newFav = {
      id: 'fav-3',
      userId: 'user-1',
      productId: 'prod-2',
      hairstyleId: null,
      createdAt: new Date(),
      product: { id: 'prod-2', name: 'Champagne Shadow' },
    };
    (prisma.favorite.create as jest.Mock).mockResolvedValue(newFav);

    const res = await request(app)
      .post('/api/favorites/makeup/prod-2')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Added to favorites');
  });

  it('returns 400 for duplicate favorite (P2002)', async () => {
    (prisma.favorite.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

    const res = await request(app)
      .post('/api/favorites/makeup/prod-1')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Already in favorites');
  });
});

describe('POST /api/favorites/hairstyle/:hairstyleId', () => {
  it('adds a hairstyle to favorites', async () => {
    const newFav = {
      id: 'fav-4',
      userId: 'user-1',
      productId: null,
      hairstyleId: 'hair-2',
      createdAt: new Date(),
      hairstyle: { id: 'hair-2', name: 'Pixie Cut' },
    };
    (prisma.favorite.create as jest.Mock).mockResolvedValue(newFav);

    const res = await request(app)
      .post('/api/favorites/hairstyle/hair-2')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Added to favorites');
  });

  it('returns 400 for duplicate hairstyle favorite', async () => {
    (prisma.favorite.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

    const res = await request(app)
      .post('/api/favorites/hairstyle/hair-1')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Already in favorites');
  });
});

describe('DELETE /api/favorites/makeup/:productId', () => {
  it('removes a makeup product from favorites', async () => {
    (prisma.favorite.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

    const res = await request(app)
      .delete('/api/favorites/makeup/prod-1')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Removed from favorites');
  });
});

describe('DELETE /api/favorites/hairstyle/:hairstyleId', () => {
  it('removes a hairstyle from favorites', async () => {
    (prisma.favorite.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

    const res = await request(app)
      .delete('/api/favorites/hairstyle/hair-1')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Removed from favorites');
  });
});
