import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { PricingRequestDto } from './dto/pricing-request.dto';
import { PricingResponseDto } from './dto/pricing-response.dto';
import { PricingService } from './pricing.service';

@Controller('api/parcels')
export class ParcelsController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('calculate')
  @HttpCode(200)
  calculatePrice(@Body() request: PricingRequestDto): PricingResponseDto {
    return this.pricingService.calculatePrice(request);
  }

  @Get('test')
  test(): string {
    return 'Parcel Pricing System API is working!';
  }
}
