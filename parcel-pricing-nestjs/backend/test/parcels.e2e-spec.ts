import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/main';

describe('Parcels API (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication<NestExpressApplication>();
    configureApp(app);
    await app.init();
  });
  afterAll(() => app.close());

  const post = (body: unknown) =>
    request(app.getHttpServer()).post('/api/parcels/calculate').send(body as object);

  it('GET /api/parcels/test', async () => {
    const r = await request(app.getHttpServer()).get('/api/parcels/test');
    expect(r.status).toBe(200);
    expect(r.text).toBe('Parcel Pricing System API is working!');
  });

  it('calculates a price', async () => {
    const r = await post({ category: 'FRAGILE', weight: 1, length: 60, width: 40, height: 30 });
    expect(r.status).toBe(200);
    expect(r.body).toEqual({
      category: 'FRAGILE', actualWeight: 1, volumetricWeight: 14.4, chargeableWeight: 15,
      baseCharge: 400, weightCharge: 1500, oversizedSurcharge: 250, totalPrice: 2150,
    });
  });

  it('returns required-field messages', async () => {
    const r = await post({});
    expect(r.status).toBe(400);
    expect(r.body).toEqual({
      category: 'Parcel category is required',
      weight: 'Weight is required',
      length: 'Length is required',
      width: 'Width is required',
      height: 'Height is required',
    });
  });

  it('rejects zero / negative values', async () => {
    const r = await post({ category: 'NORMAL', weight: 0, length: -1, width: 1, height: 1 });
    expect(r.status).toBe(400);
    expect(r.body).toEqual({
      weight: 'Weight must be greater than zero',
      length: 'Length must be greater than zero',
    });
  });

  it('rejects unknown category and wrong types with generic error', async () => {
    const generic = { error: 'Invalid request data. Check category and numeric values.' };
    let r = await post({ category: 'BOX', weight: 1, length: 1, width: 1, height: 1 });
    expect(r.status).toBe(400);
    expect(r.body).toEqual(generic);
    r = await post({ category: 'NORMAL', weight: 'abc', length: 1, width: 1, height: 1 });
    expect(r.body).toEqual(generic);
  });

  it('rejects malformed JSON', async () => {
    const r = await request(app.getHttpServer())
      .post('/api/parcels/calculate').set('Content-Type', 'application/json').send('{bad');
    expect(r.status).toBe(400);
    expect(r.body).toEqual({ error: 'Invalid request data. Check category and numeric values.' });
  });

  it('allows CORS from any localhost port', async () => {
    const r = await request(app.getHttpServer())
      .options('/api/parcels/calculate')
      .set('Origin', 'http://localhost:5174')
      .set('Access-Control-Request-Method', 'POST');
    expect(r.headers['access-control-allow-origin']).toBe('http://localhost:5174');
    const bad = await request(app.getHttpServer())
      .options('/api/parcels/calculate')
      .set('Origin', 'http://evil.com')
      .set('Access-Control-Request-Method', 'POST');
    expect(bad.headers['access-control-allow-origin']).toBeUndefined();
  });
});
