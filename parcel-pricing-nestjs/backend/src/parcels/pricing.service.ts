
// Import Injectable decorator to allow NestJS to manage this service.
import { Injectable } from '@nestjs/common';

// Import category-based base delivery charges.
import { BASE_CHARGE } from './parcel-category.enum';

// Import the DTO that defines the incoming parcel information.
import { PricingRequestDto } from './dto/pricing-request.dto';

// Import the DTO that defines the pricing result structure.
import { PricingResponseDto } from './dto/pricing-response.dto';

// Set the delivery charge for each chargeable kilogram.
const PRICE_PER_KG = 100;

// Set the additional charge for oversized parcels.
const OVERSIZED_SURCHARGE = 250;

// Set the divisor used in the volumetric weight formula.
const VOLUMETRIC_DIVISOR = 5000;

// Set the maximum allowed dimension before an extra charge applies.
const MAX_DIMENSION = 50;

// Make this class available to NestJS dependency injection.
@Injectable()
export class PricingService {

  // Receive parcel information and return the calculated pricing details.
  calculatePrice(request: PricingRequestDto): PricingResponseDto {

    // Extract the required values from the incoming request object.
    const { category, weight, length, width, height } = request;

    // Store the physical weight of the parcel.
    const actualWeight = weight;

    // Calculate the parcel's volumetric weight using its dimensions.
    const volumetricWeight =
      (length * width * height) / VOLUMETRIC_DIVISOR;

    // Select the higher weight and round it up to a whole kilogram.
    const chargeableWeight =
      Math.ceil(Math.max(actualWeight, volumetricWeight));

    // Get the base delivery charge according to the parcel category.
    const baseCharge = BASE_CHARGE[category];

    // Calculate the delivery charge based on chargeable weight.
    const weightCharge = chargeableWeight * PRICE_PER_KG;

    // Check whether any dimension is greater than the maximum dimension.
    const isOversized =
      length > MAX_DIMENSION ||
      width > MAX_DIMENSION ||
      height > MAX_DIMENSION;

    // Apply the oversized surcharge if the parcel is oversized.
    // Otherwise, the surcharge will be zero.
    const oversizedSurcharge =
      isOversized ? OVERSIZED_SURCHARGE : 0;

    // Calculate the final delivery price by adding all charges.
    const totalPrice =
      baseCharge + weightCharge + oversizedSurcharge;

    // Return all calculated pricing information to the controller.
    return {
      category,
      actualWeight,
      volumetricWeight,
      chargeableWeight,
      baseCharge,
      weightCharge,
      oversizedSurcharge,
      totalPrice,
    };
  }
}
