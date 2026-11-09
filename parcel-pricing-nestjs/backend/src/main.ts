import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { buildValidationPipe } from './common/validation';

/** Shared by main.ts and the e2e tests so both behave identically. */
export function configureApp(app: NestExpressApplication) {
  // Accept localhost / 127.0.0.1 on any port (Vite may start on 5174, 3000, ...)
  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
  });
  app.useGlobalPipes(buildValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  configureApp(app);
  const port = Number(process.env.PORT) || 8080;
  await app.listen(port);
  console.log(`Parcel Pricing API running on http://localhost:${port}`);
}

if (require.main === module) {
  bootstrap();
}
