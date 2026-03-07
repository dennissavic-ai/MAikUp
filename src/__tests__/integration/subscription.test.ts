import request from 'supertest';
import app from '../../app';

require('../setup');

describe('GET /api/subscription/plans', () => {
  it('returns all subscription plans', async () => {
    const res = await request(app).get('/api/subscription/plans');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(3);

    const [free, basic, premium] = res.body.data;

    expect(free.tier).toBe('FREE');
    expect(free.price.monthly).toBe(0);
    expect(free.features.length).toBeGreaterThan(0);

    expect(basic.tier).toBe('BASIC');
    expect(basic.price.monthly).toBe(4.99);
    expect(basic.price.yearly).toBe(39.99);

    expect(premium.tier).toBe('PREMIUM');
    expect(premium.price.monthly).toBe(9.99);
    expect(premium.price.yearly).toBe(79.99);
  });

  it('free plan has fewer features than premium', async () => {
    const res = await request(app).get('/api/subscription/plans');

    const [free, , premium] = res.body.data;
    expect(premium.features.length).toBeGreaterThan(free.features.length);
  });
});
