
/**
 * Import reflect-metadata to support metadata used by NestJS decorators
 * and Dependency Injection.
 */
import 'reflect-metadata';

// Import NestFactory to create the NestJS application.
import { NestFactory } from '@nestjs/core';

// Import the Express application type.
import { NestExpressApplication } from '@nestjs/platform-express';

// Import the root application module.
import { AppModule } from './app.module';

// Import the custom global exception filter.
import { AllExceptionsFilter } from './common/all-exceptions.filter';

// Import the function that creates the validation pipe.
import { buildValidationPipe } from './common/validation';

/**
 * Configure the application.
 * This function can also be reused by e2e tests.
 */
export function configureApp(app: NestExpressApplication) {

  // Enable CORS to allow local frontend applications
  // running on localhost or 127.0.0.1 on different ports.
  app.enableCors({
    origin: [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/
    ],

    // Define the HTTP methods allowed by CORS.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    // Configure the request headers accepted by CORS.
    allowedHeaders: '*',
  });

  // Apply request validation globally throughout the application.
  app.useGlobalPipes(buildValidationPipe());

  // Register the custom exception filter globally.
  app.useGlobalFilters(new AllExceptionsFilter());
}

/**
 * Start the NestJS application.
 */
async function bootstrap() {

  // Create the NestJS application using the root AppModule.
  // Specify that the application uses the Express platform.
  const app =
    await NestFactory.create<NestExpressApplication>(AppModule);

  // Apply CORS, validation, and exception handling configuration.
  configureApp(app);

  // Use the PORT environment variable if available.
  // Otherwise, use port 8080.
  const port = Number(process.env.PORT) || 8080;

  // Start the backend server on the selected port.
  await app.listen(port);

  // Display a message after the server starts successfully.
  console.log(
    `Parcel Pricing API running on http://localhost:${port}`
  );
}

// Start the application only when this file is executed directly.
// This condition is for CommonJS projects.
if (require.main === module) {
  bootstrap();
}
