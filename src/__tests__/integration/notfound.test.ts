import request from 'supertest';
import app from '../../app';

require('../setup');

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Route not found');
  });

  it('returns 404 for unknown nested routes', async () => {
    const res = await request(app).get('/api/some/deep/nonexistent/route');

    expect(res.status).toBe(404);
  });
});
