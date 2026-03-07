import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';
import { firebaseAuth } from '../../config/firebase';

require('../setup');

// Valid UUIDs for test data
const USER_ID = '00000000-0000-4000-8000-000000000001';
const PRODUCT_ID_1 = '00000000-0000-4000-8000-000000000010';
const PRODUCT_ID_2 = '00000000-0000-4000-8000-000000000011';
const HAIRSTYLE_ID_1 = '00000000-0000-4000-8000-000000000020';
const HAIRSTYLE_ID_2 = '00000000-0000-4000-8000-000000000021';

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

const mockFavorites = [
  {
    id: 'fav-1',
    userId: USER_ID,
    productId: PRODUCT_ID_1,
    hairstyleId: null,
    createdAt: new Date(),
    product: { id: PRODUCT_ID_1, name: 'Red Lipstick' },
    hairstyle: null,
  },
  {
    id: 'fav-2',
    userId: USER_ID,
    productId: null,
    hairstyleId: HAIRSTYLE_ID_1,
    createdAt: new Date(),
    product: null,
    hairstyle: { id: HAIRSTYLE_ID_1, name: 'Beach Waves' },
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
      userId: USER_ID,
      productId: PRODUCT_ID_2,
      hairstyleId: null,
      createdAt: new Date(),
      product: { id: PRODUCT_ID_2, name: 'Champagne Shadow' },
    };
    (prisma.favorite.create as jest.Mock).mockResolvedValue(newFav);

    const res = await request(app)
      .post(`/api/favorites/makeup/${PRODUCT_ID_2}`)
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Added to favorites');
  });

  it('returns 400 for duplicate favorite (P2002)', async () => {
    (prisma.favorite.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

    const res = await request(app)
      .post(`/api/favorites/makeup/${PRODUCT_ID_1}`)
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Already in favorites');
  });
});

describe('POST /api/favorites/hairstyle/:hairstyleId', () => {
  it('adds a hairstyle to favorites', async () => {
    const newFav = {
      id: 'fav-4',
      userId: USER_ID,
      productId: null,
      hairstyleId: HAIRSTYLE_ID_2,
      createdAt: new Date(),
      hairstyle: { id: HAIRSTYLE_ID_2, name: 'Pixie Cut' },
    };
    (prisma.favorite.create as jest.Mock).mockResolvedValue(newFav);

    const res = await request(app)
      .post(`/api/favorites/hairstyle/${HAIRSTYLE_ID_2}`)
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Added to favorites');
  });

  it('returns 400 for duplicate hairstyle favorite', async () => {
    (prisma.favorite.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

    const res = await request(app)
      .post(`/api/favorites/hairstyle/${HAIRSTYLE_ID_1}`)
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Already in favorites');
  });
});

describe('DELETE /api/favorites/makeup/:productId', () => {
  it('removes a makeup product from favorites', async () => {
    (prisma.favorite.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

    const res = await request(app)
      .delete(`/api/favorites/makeup/${PRODUCT_ID_1}`)
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
      .delete(`/api/favorites/hairstyle/${HAIRSTYLE_ID_1}`)
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Removed from favorites');
  });
});
