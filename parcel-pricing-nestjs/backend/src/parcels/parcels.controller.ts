
// Import the required NestJS decorators.
// Body: Extracts data from the HTTP request body.
// Controller: Defines a controller class.
// Get: Handles GET requests.
// HttpCode: Sets the HTTP response status code.
// Post: Handles POST requests.
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post
} from '@nestjs/common';


// Import the request DTO.
// It defines the parcel information received from the frontend.
import { PricingRequestDto } from './dto/pricing-request.dto';


// Import the response DTO.
// It defines the structure of the calculated pricing response.
import { PricingResponseDto } from './dto/pricing-response.dto';


// Import the service.
// It contains the actual parcel pricing calculation logic.
import { PricingService } from './pricing.service';


// Define the common URL prefix for all endpoints in this controller.
// Example: /api/parcels/calculate
@Controller('api/parcels')


// Create and export the ParcelsController class.
// This class handles parcel-related HTTP requests.
export class ParcelsController {

  // Constructor performs Dependency Injection.
  // NestJS automatically provides the PricingService instance.
  // private: Access the service within this class.
  // readonly: Prevent reassignment of the service property.
  constructor(
    private readonly pricingService: PricingService
  ) {}


  // Define a POST endpoint for parcel price calculation.
  // Complete endpoint: POST /api/parcels/calculate
  @Post('calculate')

  // Return HTTP 200 OK when the calculation succeeds.
  // POST normally returns 201 by default in NestJS.
  @HttpCode(200)

  // Handle the price calculation request.
  // @Body(): Extract parcel information from the request body.
  // PricingRequestDto: Defines the expected input structure.
  // PricingResponseDto: Defines the expected output structure.
  calculatePrice(
    @Body() request: PricingRequestDto
  ): PricingResponseDto {

    // Call the PricingService to calculate the parcel price.
    // Pass the received parcel information to the service.
    // Return the calculated result to the frontend.
    return this.pricingService.calculatePrice(request);
  }


  // Define a GET endpoint to test the backend API.
  // Complete endpoint: GET /api/parcels/test
  @Get('test')

  // Create a test method that returns a string.
  test(): string {

    // Return a message to confirm that the API is working.
    return 'Parcel Pricing System API is working!';
  }

}
