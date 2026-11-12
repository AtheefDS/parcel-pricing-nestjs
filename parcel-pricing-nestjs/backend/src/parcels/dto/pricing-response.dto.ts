
/*
 * PricingResponseDto
 *
 * Defines the structure of the response
 * that the backend sends to the frontend.
 */
export interface PricingResponseDto {

  // Stores the parcel category.
  // Example: STANDARD, FRAGILE, EXPRESS.
  category: string;

  // Stores the actual physical weight of the parcel in kg.
  actualWeight: number;

  // Stores the weight calculated using parcel dimensions.
  // Formula: (Length * Width * Height) / 5000.
  volumetricWeight: number;

  // Stores the weight used for price calculation.
  // Usually the higher value between actual and volumetric weight.
  chargeableWeight: number;

  // Stores the basic delivery charge in LKR.
  baseCharge: number;

  // Stores the additional charge based on chargeable weight.
  weightCharge: number;

  // Stores the additional charge for oversized parcels.
  oversizedSurcharge: number;

  // Stores the final delivery price.
  // Formula: baseCharge + weightCharge + oversizedSurcharge.
  totalPrice: number;
}
