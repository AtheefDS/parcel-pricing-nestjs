
// Import Test to create a NestJS testing environment.
import { Test } from '@nestjs/testing';

// Import the Express application type.
import { NestExpressApplication } from '@nestjs/platform-express';

// Import Supertest to send HTTP requests during testing.
import request from 'supertest';

// Import the root application module.
import { AppModule } from '../src/app.module';

// Import the same configuration used by the actual backend.
import { configureApp } from '../src/main';

// Group all end-to-end tests for the Parcel API.
describe('Parcels API (e2e)', () => {

  // Declare a variable to store the testing application.
  let app: NestExpressApplication;

  // Run once before all test cases.
  beforeAll(async () => {

    // Create and compile the testing module using AppModule.
    const mod = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    // Create a NestJS Express application for testing.
    app = mod.createNestApplication<NestExpressApplication>();

    // Apply the same CORS, validation and exception settings.
    configureApp(app);

    // Initialize the testing application.
    await app.init();
  });

  // Close the application after all test cases finish.
  afterAll(() => app.close());

  // Create a reusable helper function for POST requests.
  const post = (body: unknown) =>
    request(app.getHttpServer())
      .post('/api/parcels/calculate')
      .send(body as object);

  // Test whether the parcel API test endpoint works.
  it('GET /api/parcels/test', async () => {

    // Send a GET request to the test endpoint.
    const r = await request(app.getHttpServer())
      .get('/api/parcels/test');

    // Check whether the response status is 200.
    expect(r.status).toBe(200);

    // Check whether the expected response message is returned.
    expect(r.text).toBe('Parcel Pricing System API is working!');
  });

  // Test whether the backend calculates parcel prices correctly.
  it('calculates a price', async () => {

    // Send a valid FRAGILE parcel request.
    const r = await post({
      category: 'FRAGILE',
      weight: 1,
      length: 60,
      width: 40,
      height: 30
    });

    // Check whether the request succeeds.
    expect(r.status).toBe(200);

    // Check whether all calculated values are correct.
    expect(r.body).toEqual({
      category: 'FRAGILE',
      actualWeight: 1,
      volumetricWeight: 14.4,
      chargeableWeight: 15,
      baseCharge: 400,
      weightCharge: 1500,
      oversizedSurcharge: 250,
      totalPrice: 2150,
    });
  });

  // Test whether the backend rejects requests with missing fields.
  it('returns required-field messages', async () => {

    // Send an empty request body.
    const r = await post({});

    // Check whether the backend returns Bad Request.
    expect(r.status).toBe(400);

    // Check whether all required-field messages are returned.
    expect(r.body).toEqual({
      category: 'Parcel category is required',
      weight: 'Weight is required',
      length: 'Length is required',
      width: 'Width is required',
      height: 'Height is required',
    });
  });

  // Test whether zero and negative numeric values are rejected.
  it('rejects zero / negative values', async () => {

    // Send a request containing invalid weight and length.
    const r = await post({
      category: 'NORMAL',
      weight: 0,
      length: -1,
      width: 1,
      height: 1
    });

    // Check whether the backend returns Bad Request.
    expect(r.status).toBe(400);

    // Check the validation messages for invalid fields.
    expect(r.body).toEqual({
      weight: 'Weight must be greater than zero',
      length: 'Length must be greater than zero',
    });
  });

  // Test whether unknown categories and incorrect data types are rejected.
  it('rejects unknown category and wrong types with generic error', async () => {

    // Define the expected generic error response.
    const generic = {
      error: 'Invalid request data. Check category and numeric values.'
    };

    // Send an invalid parcel category.
    let r = await post({
      category: 'BOX',
      weight: 1,
      length: 1,
      width: 1,
      height: 1
    });

    // Check the status and error response.
    expect(r.status).toBe(400);
    expect(r.body).toEqual(generic);

    // Send an invalid string value instead of numeric weight.
    r = await post({
      category: 'NORMAL',
      weight: 'abc',
      length: 1,
      width: 1,
      height: 1
    });

    // Check the error response for the incorrect data type.
    expect(r.status).toBe(400);
    expect(r.body).toEqual(generic);
  });

  // Test whether the backend rejects incorrectly formatted JSON.
  it('rejects malformed JSON', async () => {

    // Send invalid JSON text with the JSON content type.
    const r = await request(app.getHttpServer())
      .post('/api/parcels/calculate')
      .set('Content-Type', 'application/json')
      .send('{bad');

    // Check whether the backend returns Bad Request.
    expect(r.status).toBe(400);

    // Check the expected error response.
    expect(r.body).toEqual({
      error: 'Invalid request data. Check category and numeric values.'
    });
  });

  // Test whether CORS allows localhost and rejects unapproved origins.
  it('allows CORS from any localhost port', async () => {

    // Simulate a CORS preflight request from localhost port 5174.
    const r = await request(app.getHttpServer())
      .options('/api/parcels/calculate')
      .set('Origin', 'http://localhost:5174')
      .set('Access-Control-Request-Method', 'POST');

    // Check whether localhost:5174 is allowed.
    expect(r.headers['access-control-allow-origin'])
      .toBe('http://localhost:5174');

    // Simulate a CORS preflight request from an unapproved origin.
    const bad = await request(app.getHttpServer())
      .options('/api/parcels/calculate')
      .set('Origin', 'http://evil.com')
      .set('Access-Control-Request-Method', 'POST');

    // Check that the unapproved origin is not allowed.
    expect(bad.headers['access-control-allow-origin'])
      .toBeUndefined();
  });
});
