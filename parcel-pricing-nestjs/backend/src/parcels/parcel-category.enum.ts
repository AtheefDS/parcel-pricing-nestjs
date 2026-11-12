
/*
 * Define the available parcel categories.
 * Enum prevents using random category values
 * throughout the Parcel Pricing System.
 */
export enum ParcelCategory {

  // Category for documents such as letters and files.
  DOCUMENT = 'DOCUMENT',

  // Category for ordinary parcels.
  NORMAL = 'NORMAL',

  // Category for delicate or breakable parcels.
  FRAGILE = 'FRAGILE',
}


/*
 * Define the base delivery charge for each parcel category.
 * The charges are calculated in Sri Lankan Rupees (LKR).
 */
export const BASE_CHARGE: Record<ParcelCategory, number> = {

  // DOCUMENT parcels have a base charge of Rs. 150.
  [ParcelCategory.DOCUMENT]: 150,

  // NORMAL parcels have a base charge of Rs. 250.
  [ParcelCategory.NORMAL]: 250,

  // FRAGILE parcels have a base charge of Rs. 400.
  [ParcelCategory.FRAGILE]: 400,

};
