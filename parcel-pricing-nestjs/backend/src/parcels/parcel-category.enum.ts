export enum ParcelCategory {
  DOCUMENT = 'DOCUMENT',
  NORMAL = 'NORMAL',
  FRAGILE = 'FRAGILE',
}

/** Base charge (Rs.) per category - same values as the Spring Boot enum. */
export const BASE_CHARGE: Record<ParcelCategory, number> = {
  [ParcelCategory.DOCUMENT]: 150,
  [ParcelCategory.NORMAL]: 250,
  [ParcelCategory.FRAGILE]: 400,
};
