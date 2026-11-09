import { Module } from '@nestjs/common';
import { ParcelsController } from './parcels.controller';
import { PricingService } from './pricing.service';

@Module({
  controllers: [ParcelsController],
  providers: [PricingService],
})
export class ParcelsModule {}
