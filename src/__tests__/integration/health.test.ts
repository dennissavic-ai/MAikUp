import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

// Load mocks
require('../setup');

describe('GET /api/health', () => {
  it('returns healthy when database is connected', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.timestamp).toBeDefined();
    expect(res.body.data.uptime).toBeDefined();
  });

  it('returns 503 when database is disconnected', async () => {
    (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error('Connection failed'));

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Database connection failed');
  });
});
