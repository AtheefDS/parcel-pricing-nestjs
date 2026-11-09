# Parcel Pricing System (NestJS + React)

Same system as the original Spring Boot version, with the backend rewritten in NestJS.
The API contract (URL, port, JSON, error messages, CORS rules) is identical,
so the React frontend works as before.

```
backend/    NestJS API  (port 8080)
frontend/   React + Vite (port 5173)
```

## Run

Terminal 1 - backend
```
cd backend
npm install
npm run start:dev
```
Check: http://localhost:8080/api/parcels/test

Terminal 2 - frontend
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

To use another API address, copy `frontend/.env.example` to `frontend/.env` and edit `VITE_API_URL`.
To change the backend port: `PORT=3000 npm run start:dev`.

## API

`POST /api/parcels/calculate`
```json
{ "category": "NORMAL", "weight": 2.5, "length": 70, "width": 30, "height": 20 }
```
`category` is DOCUMENT | NORMAL | FRAGILE. Response:
```json
{ "category": "NORMAL", "actualWeight": 2.5, "volumetricWeight": 8.4, "chargeableWeight": 9,
  "baseCharge": 250, "weightCharge": 900, "oversizedSurcharge": 250, "totalPrice": 1400 }
```

Pricing rules: base charge DOCUMENT 150 / NORMAL 250 / FRAGILE 400; volumetric weight = L*W*H / 5000;
chargeable weight = ceil(max(actual, volumetric)); Rs. 100 per kg; Rs. 250 surcharge if any side > 50 cm.

Errors: 400 `{ "weight": "Weight must be greater than zero" }` (field rules),
400 `{ "error": "Invalid request data. Check category and numeric values." }` (bad body),
500 `{ "error": "Something went wrong" }`.

## Tests
```
cd backend
npm test            # unit
npm run test:e2e    # API tests
```

## Where things moved from Spring Boot
| Spring Boot | NestJS |
|---|---|
| ParcelController | backend/src/parcels/parcels.controller.ts |
| PricingService | backend/src/parcels/pricing.service.ts |
| ParcelCategory | backend/src/parcels/parcel-category.enum.ts |
| PricingRequest / PricingResponse | backend/src/parcels/dto/ |
| GlobalExceptionHandler | backend/src/common/all-exceptions.filter.ts + validation.ts |
| CorsConfig | `enableCors` in backend/src/main.ts |
