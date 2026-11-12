
// Import the Module decorator from the NestJS common package.
import { Module } from '@nestjs/common';

// Import ParcelsModule to connect parcel-related functionality.
import { ParcelsModule } from './parcels/parcels.module';

// Define this class as the root module of the application.
@Module({

  // Import other modules required by this application.
  // ParcelsModule contains the parcel controller and pricing service.
  imports: [ParcelsModule],

})

// Create and export the root module.
export class AppModule {}
