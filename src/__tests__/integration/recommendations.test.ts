import request from 'supertest';
import app from '../../app';

require('../setup');

describe('GET /api/recommendations/skin-tones', () => {
  it('returns skin tone reference data', async () => {
    const res = await request(app).get('/api/recommendations/skin-tones');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.skinTones).toBeDefined();
    expect(res.body.data.undertones).toBeDefined();
    expect(res.body.data.faceShapes).toBeDefined();

    // Should have comprehensive skin tone list
    expect(res.body.data.skinTones.length).toBeGreaterThanOrEqual(8);

    // Should have 3 undertone options
    expect(res.body.data.undertones).toHaveLength(3);
    const undertoneValues = res.body.data.undertones.map((u: any) => u.value);
    expect(undertoneValues).toContain('warm');
    expect(undertoneValues).toContain('cool');
    expect(undertoneValues).toContain('neutral');

    // Should have face shapes
    expect(res.body.data.faceShapes.length).toBeGreaterThanOrEqual(5);
  });

  it('each skin tone has value, label, and description', async () => {
    const res = await request(app).get('/api/recommendations/skin-tones');

    for (const tone of res.body.data.skinTones) {
      expect(tone).toHaveProperty('value');
      expect(tone).toHaveProperty('label');
      expect(tone).toHaveProperty('description');
      expect(tone.value).toBeTruthy();
      expect(tone.label).toBeTruthy();
    }
  });
});
