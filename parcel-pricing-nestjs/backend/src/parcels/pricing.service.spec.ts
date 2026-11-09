import { ParcelCategory } from './parcel-category.enum';
import { PricingService } from './pricing.service';

describe('PricingService', () => {
  const service = new PricingService();

  it('uses actual weight when heavier than volumetric', () => {
    const r = service.calculatePrice({
      category: ParcelCategory.NORMAL, weight: 2.3, length: 10, width: 10, height: 10,
    });
    expect(r.volumetricWeight).toBe(0.2);
    expect(r.chargeableWeight).toBe(3); // ceil(2.3)
    expect(r.baseCharge).toBe(250);
    expect(r.weightCharge).toBe(300);
    expect(r.oversizedSurcharge).toBe(0);
    expect(r.totalPrice).toBe(550);
  });

  it('uses volumetric weight when larger and adds oversized surcharge', () => {
    const r = service.calculatePrice({
      category: ParcelCategory.FRAGILE, weight: 1, length: 60, width: 40, height: 30,
    });
    expect(r.volumetricWeight).toBe(14.4);
    expect(r.chargeableWeight).toBe(15);
    expect(r.oversizedSurcharge).toBe(250);
    expect(r.totalPrice).toBe(400 + 1500 + 250);
  });

  it('does not treat exactly 50cm as oversized', () => {
    const r = service.calculatePrice({
      category: ParcelCategory.DOCUMENT, weight: 1, length: 50, width: 50, height: 50,
    });
    expect(r.oversizedSurcharge).toBe(0);
    expect(r.baseCharge).toBe(150);
  });
});
