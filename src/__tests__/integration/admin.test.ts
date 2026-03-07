import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';
import { firebaseAuth } from '../../config/firebase';

require('../setup');

const ADMIN_ID = '00000000-0000-4000-8000-000000000002';
const USER_ID = '00000000-0000-4000-8000-000000000001';
const PRODUCT_ID = '00000000-0000-4000-8000-000000000010';
const HAIRSTYLE_ID = '00000000-0000-4000-8000-000000000020';
const LOOK_ID = '00000000-0000-4000-8000-000000000030';

const mockAdminUser = {
  id: ADMIN_ID,
  firebaseUid: 'firebase-1',
  email: 'admin@test.com',
  displayName: 'Admin User',
  photoUrl: null,
  role: 'ADMIN',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRegularUser = {
  ...mockAdminUser,
  id: USER_ID,
  role: 'USER',
  email: 'user@test.com',
};

beforeEach(() => {
  jest.clearAllMocks();
  (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({
    uid: 'firebase-1',
    email: 'admin@test.com',
  });
  // Default to admin user; tests for non-admin override this
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);
});

describe('GET /api/admin/stats', () => {
  it('returns dashboard stats for admin', async () => {
    (prisma.user.count as jest.Mock)
      .mockResolvedValueOnce(100)   // totalUsers
      .mockResolvedValueOnce(15);   // recentSignups
    (prisma.subscription.count as jest.Mock).mockResolvedValue(25);
    (prisma.makeupProduct.count as jest.Mock).mockResolvedValue(50);
    (prisma.hairstyle.count as jest.Mock).mockResolvedValue(30);
    (prisma.makeupLook.count as jest.Mock).mockResolvedValue(20);
    (prisma.subscription.groupBy as jest.Mock).mockResolvedValue([
      { tier: 'FREE', _count: { id: 75 } },
      { tier: 'BASIC', _count: { id: 15 } },
      { tier: 'PREMIUM', _count: { id: 10 } },
    ]);

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalUsers).toBe(100);
    expect(res.body.data.activeSubscriptions).toBe(25);
    expect(res.body.data.totalProducts).toBe(50);
    expect(res.body.data.totalHairstyles).toBe(30);
    expect(res.body.data.totalLooks).toBe(20);
    expect(res.body.data.recentSignups).toBe(15);
    expect(res.body.data.subscriptionBreakdown).toHaveLength(3);
  });

  it('returns 403 for non-admin user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockRegularUser);

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Admin access required');
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/admin/stats');

    expect(res.status).toBe(401);
  });
});

describe('GET /api/admin/users', () => {
  it('returns paginated users', async () => {
    const mockUsers = [
      { ...mockRegularUser, subscription: { tier: 'FREE' }, _count: { favorites: 3, savedLooks: 2 } },
    ];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    (prisma.user.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toBeDefined();
  });

  it('supports search query', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.user.count as jest.Mock).mockResolvedValue(0);

    const res = await request(app)
      .get('/api/admin/users?search=test')
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});

describe('PATCH /api/admin/users/:id/role', () => {
  it('updates user role', async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue({
      ...mockRegularUser,
      role: 'ADMIN',
    });

    const res = await request(app)
      .patch(`/api/admin/users/${USER_ID}/role`)
      .set('Authorization', 'Bearer test-token')
      .send({ role: 'ADMIN' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User role updated');
  });

  it('returns 400 for invalid role', async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${USER_ID}/role`)
      .set('Authorization', 'Bearer test-token')
      .send({ role: 'SUPERADMIN' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/admin/products', () => {
  it('creates a new product', async () => {
    const newProduct = {
      id: PRODUCT_ID,
      category: 'LIPS',
      subcategory: 'lipstick',
      name: 'New Lipstick',
      colorHex: '#FF0000',
      isActive: true,
    };
    (prisma.makeupProduct.create as jest.Mock).mockResolvedValue(newProduct);

    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', 'Bearer test-token')
      .send({
        category: 'LIPS',
        subcategory: 'lipstick',
        name: 'New Lipstick',
        colorHex: '#FF0000',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Product created');
  });
});

describe('PATCH /api/admin/products/:id', () => {
  it('updates a product', async () => {
    (prisma.makeupProduct.update as jest.Mock).mockResolvedValue({
      id: PRODUCT_ID,
      name: 'Updated Lipstick',
    });

    const res = await request(app)
      .patch(`/api/admin/products/${PRODUCT_ID}`)
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'Updated Lipstick' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Product updated');
  });
});

describe('DELETE /api/admin/products/:id', () => {
  it('deactivates a product (soft delete)', async () => {
    (prisma.makeupProduct.update as jest.Mock).mockResolvedValue({
      id: PRODUCT_ID,
      isActive: false,
    });

    const res = await request(app)
      .delete(`/api/admin/products/${PRODUCT_ID}`)
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Product deactivated');
  });
});

describe('POST /api/admin/hairstyles', () => {
  it('creates a new hairstyle', async () => {
    const newHairstyle = {
      id: HAIRSTYLE_ID,
      name: 'New Style',
      category: 'CUT',
      subcategory: 'bob',
      isActive: true,
    };
    (prisma.hairstyle.create as jest.Mock).mockResolvedValue(newHairstyle);

    const res = await request(app)
      .post('/api/admin/hairstyles')
      .set('Authorization', 'Bearer test-token')
      .send({
        category: 'CUT',
        subcategory: 'bob',
        name: 'New Style',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Hairstyle created');
  });
});

describe('PATCH /api/admin/hairstyles/:id', () => {
  it('updates a hairstyle', async () => {
    (prisma.hairstyle.update as jest.Mock).mockResolvedValue({
      id: HAIRSTYLE_ID,
      name: 'Updated Style',
    });

    const res = await request(app)
      .patch(`/api/admin/hairstyles/${HAIRSTYLE_ID}`)
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'Updated Style' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hairstyle updated');
  });
});

describe('DELETE /api/admin/hairstyles/:id', () => {
  it('deactivates a hairstyle', async () => {
    (prisma.hairstyle.update as jest.Mock).mockResolvedValue({
      id: HAIRSTYLE_ID,
      isActive: false,
    });

    const res = await request(app)
      .delete(`/api/admin/hairstyles/${HAIRSTYLE_ID}`)
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hairstyle deactivated');
  });
});

describe('POST /api/admin/looks', () => {
  it('creates a new look with products', async () => {
    const newLook = {
      id: LOOK_ID,
      name: 'Evening Glam',
      style: 'glam',
      products: [{ product: { id: PRODUCT_ID } }],
    };
    (prisma.makeupLook.create as jest.Mock).mockResolvedValue(newLook);

    const res = await request(app)
      .post('/api/admin/looks')
      .set('Authorization', 'Bearer test-token')
      .send({
        name: 'Evening Glam',
        style: 'glam',
        productIds: [PRODUCT_ID],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Look created');
  });
});

describe('PATCH /api/admin/looks/:id', () => {
  it('updates a look', async () => {
    (prisma.makeupLook.update as jest.Mock).mockResolvedValue({
      id: LOOK_ID,
      name: 'Updated Look',
    });
    (prisma.makeupLook.findUnique as jest.Mock).mockResolvedValue({
      id: LOOK_ID,
      name: 'Updated Look',
      products: [],
    });

    const res = await request(app)
      .patch(`/api/admin/looks/${LOOK_ID}`)
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'Updated Look' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Look updated');
  });
});

describe('DELETE /api/admin/looks/:id', () => {
  it('deactivates a look', async () => {
    (prisma.makeupLook.update as jest.Mock).mockResolvedValue({
      id: LOOK_ID,
      isActive: false,
    });

    const res = await request(app)
      .delete(`/api/admin/looks/${LOOK_ID}`)
      .set('Authorization', 'Bearer test-token');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Look deactivated');
  });
});
