
// Import ParcelCategory enum.
// We use this to select parcel categories in our test inputs.
import { ParcelCategory } from './parcel-category.enum';

// Import PricingService.
// We need to test the actual parcel pricing calculation logic.
import { PricingService } from './pricing.service';


// Create a test group for PricingService.
// describe() groups related test cases together.
describe('PricingService', () => {

  // Create an instance of PricingService.
  // We use this object to call calculatePrice() in our tests.
  const service = new PricingService();


  // TEST CASE 1:
  // Check whether actual weight is selected
  // when actual weight is greater than volumetric weight.
  it('uses actual weight when heavier than volumetric', () => {

    // Pass sample parcel details to the pricing service.
    // Store the calculated result in variable r.
    const r = service.calculatePrice({
      category: ParcelCategory.NORMAL,
      weight: 2.3,
      length: 10,
      width: 10,
      height: 10,
    });

    // Check whether volumetric weight is calculated correctly.
    // Formula: (10 * 10 * 10) / 5000 = 0.2 kg.
    expect(r.volumetricWeight).toBe(0.2);

    // Check whether actual weight is selected and rounded up.
    // Math.ceil(2.3) = 3 kg.
    expect(r.chargeableWeight).toBe(3);

    // Check whether NORMAL category has Rs. 250 base charge.
    expect(r.baseCharge).toBe(250);

    // Check whether weight charge is calculated correctly.
    // 3 kg * Rs. 100 = Rs. 300.
    expect(r.weightCharge).toBe(300);

    // Check whether no oversized surcharge is applied.
    expect(r.oversizedSurcharge).toBe(0);

    // Check whether final price is correct.
    // 250 + 300 + 0 = Rs. 550.
    expect(r.totalPrice).toBe(550);
  });


  // TEST CASE 2:
  // Check whether volumetric weight is selected
  // when it is greater than actual weight.
  // Also check whether oversized surcharge is added.
  it('uses volumetric weight when larger and adds oversized surcharge', () => {

    // Pass sample FRAGILE parcel details to the service.
    const r = service.calculatePrice({
      category: ParcelCategory.FRAGILE,
      weight: 1,
      length: 60,
      width: 40,
      height: 30,
    });

    // Check volumetric weight.
    // Formula: (60 * 40 * 30) / 5000 = 14.4 kg.
    expect(r.volumetricWeight).toBe(14.4);

    // Check whether volumetric weight is selected and rounded up.
    // Math.ceil(14.4) = 15 kg.
    expect(r.chargeableWeight).toBe(15);

    // Check whether oversized surcharge is Rs. 250.
    expect(r.oversizedSurcharge).toBe(250);

    // Check final price.
    // Base charge: 400.
    // Weight charge: 15 * 100 = 1500.
    // Oversized surcharge: 250.
    // Total: Rs. 2150.
    expect(r.totalPrice).toBe(400 + 1500 + 250);
  });


  // TEST CASE 3:
  // Check the boundary condition for oversized parcels.
  // Exactly 50 cm should NOT be treated as oversized.
  it('does not treat exactly 50cm as oversized', () => {

    // Pass sample DOCUMENT parcel details.
    // All three dimensions are exactly 50 cm.
    const r = service.calculatePrice({
      category: ParcelCategory.DOCUMENT,
      weight: 1,
      length: 50,
      width: 50,
      height: 50,
    });

    // Check whether oversized surcharge is zero.
    // Exactly 50 cm does not exceed the threshold.
    expect(r.oversizedSurcharge).toBe(0);

    // Check whether DOCUMENT category has Rs. 150 base charge.
    expect(r.baseCharge).toBe(150);
  });

});
