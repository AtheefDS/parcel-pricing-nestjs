
// Import the Module decorator from NestJS.
// This decorator is used to define a NestJS module.
import { Module } from '@nestjs/common';


// Import ParcelsController.
// This controller handles parcel-related HTTP requests.
// Example: POST /api/parcels/calculate.
import { ParcelsController } from './parcels.controller';


// Import PricingService.
// This service contains the parcel price calculation logic.
// NestJS will manage this service using Dependency Injection.
import { PricingService } from './pricing.service';


// Use the @Module decorator to define the module.
// It tells NestJS how to organize the related components.
@Module({

  // Register the controller in this module.
  // This allows NestJS to discover its HTTP endpoints.
  controllers: [ParcelsController],

  // Register the service as a provider.
  // This allows NestJS to inject PricingService
  // into ParcelsController when required.
  providers: [PricingService],

})

// Create and export the ParcelsModule class.
// Other modules can import this module.
export class ParcelsModule {}

