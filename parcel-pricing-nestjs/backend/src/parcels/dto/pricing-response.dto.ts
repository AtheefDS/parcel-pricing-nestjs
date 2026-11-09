export interface PricingResponseDto {
  category: string;
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  baseCharge: number;
  weightCharge: number;
  oversizedSurcharge: number;
  totalPrice: number;
}
