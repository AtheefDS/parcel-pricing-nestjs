import { Injectable } from '@nestjs/common';
import { BASE_CHARGE } from './parcel-category.enum';
import { PricingRequestDto } from './dto/pricing-request.dto';
import { PricingResponseDto } from './dto/pricing-response.dto';

const PRICE_PER_KG = 100;
const OVERSIZED_SURCHARGE = 250;
const VOLUMETRIC_DIVISOR = 5000;
const MAX_DIMENSION = 50;

@Injectable()
export class PricingService {
  calculatePrice(request: PricingRequestDto): PricingResponseDto {
    const { category, weight, length, width, height } = request;

    const actualWeight = weight;
    const volumetricWeight = (length * width * height) / VOLUMETRIC_DIVISOR;
    const chargeableWeight = Math.ceil(Math.max(actualWeight, volumetricWeight));

    const baseCharge = BASE_CHARGE[category];
    const weightCharge = chargeableWeight * PRICE_PER_KG;

    const isOversized =
      length > MAX_DIMENSION || width > MAX_DIMENSION || height > MAX_DIMENSION;
    const oversizedSurcharge = isOversized ? OVERSIZED_SURCHARGE : 0;

    const totalPrice = baseCharge + weightCharge + oversizedSurcharge;

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
