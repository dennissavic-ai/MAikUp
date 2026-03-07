import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

require('../setup');

describe('GET /api/search', () => {
  it('requires a search query of at least 2 characters', async () => {
    const res = await request(app).get('/api/search?q=a');

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('at least 2 characters');
  });

  it('searches across all catalogs by default', async () => {
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue([
      { id: 'p1', name: 'Red Lipstick' },
    ]);
    (prisma.makeupLook.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.hairstyle.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get('/api/search?q=red');

    expect(res.status).toBe(200);
    expect(res.body.data.query).toBe('red');
    expect(res.body.data.totalResults).toBe(1);
    expect(res.body.data.products).toHaveLength(1);
  });

  it('filters search by type=makeup', async () => {
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue([
      { id: 'p1', name: 'Red Lipstick' },
    ]);

    const res = await request(app).get('/api/search?q=red&type=makeup');

    expect(res.status).toBe(200);
    expect(res.body.data.products).toBeDefined();
    expect(res.body.data.looks).toBeUndefined();
    expect(res.body.data.hairstyles).toBeUndefined();
  });

  it('filters search by type=hairstyles', async () => {
    (prisma.hairstyle.findMany as jest.Mock).mockResolvedValue([
      { id: 'h1', name: 'Classic Bob' },
    ]);

    const res = await request(app).get('/api/search?q=bob&type=hairstyles');

    expect(res.status).toBe(200);
    expect(res.body.data.hairstyles).toBeDefined();
    expect(res.body.data.products).toBeUndefined();
  });
});

describe('GET /api/search/suggest', () => {
  it('returns empty for empty query', async () => {
    const res = await request(app).get('/api/search/suggest?q=');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('returns suggestions from multiple sources', async () => {
    (prisma.makeupProduct.findMany as jest.Mock).mockResolvedValue([
      { id: 'p1', name: 'Red Lipstick', category: 'LIPS', subcategory: 'lipstick' },
    ]);
    (prisma.makeupLook.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.hairstyle.findMany as jest.Mock).mockResolvedValue([
      { id: 'h1', name: 'Red Hair Color', category: 'COLOR' },
    ]);

    const res = await request(app).get('/api/search/suggest?q=red');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].type).toBe('product');
    expect(res.body.data[1].type).toBe('hairstyle');
  });
});
