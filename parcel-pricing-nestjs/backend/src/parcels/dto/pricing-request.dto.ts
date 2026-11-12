
// Import validation decorators from class-validator.
// These decorators validate the incoming frontend data.
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsPositive
} from 'class-validator';

// Import the ParcelCategory enum.
// This defines the allowed parcel categories.
import { ParcelCategory } from '../parcel-category.enum';

// Reusable number validation configuration.
// NaN and Infinity are not accepted as valid numbers.
const num = {
  allowNaN: false,
  allowInfinity: false
};

// DTO (Data Transfer Object).
// Defines the data structure expected from the frontend.
export class PricingRequestDto {

  // Check whether parcel category is provided.
  @IsDefined({
    message: 'Parcel category is required'
  })

  // Check whether category belongs to ParcelCategory enum.
  @IsEnum(ParcelCategory)
  category: ParcelCategory;

  // Check whether weight is provided.
  @IsDefined({
    message: 'Weight is required'
  })

  // Check whether weight is a valid number.
  @IsNumber(num)

  // Check whether weight is greater than zero.
  @IsPositive({
    message: 'Weight must be greater than zero'
  })
  weight: number;

  // Check whether length is provided.
  @IsDefined({
    message: 'Length is required'
  })

  // Check whether length is a valid number.
  @IsNumber(num)

  // Check whether length is greater than zero.
  @IsPositive({
    message: 'Length must be greater than zero'
  })
  length: number;

  // Check whether width is provided.
  @IsDefined({
    message: 'Width is required'
  })

  // Check whether width is a valid number.
  @IsNumber(num)

  // Check whether width is greater than zero.
  @IsPositive({
    message: 'Width must be greater than zero'
  })
  width: number;

  // Check whether height is provided.
  @IsDefined({
    message: 'Height is required'
  })

  // Check whether height is a valid number.
  @IsNumber(num)

  // Check whether height is greater than zero.
  @IsPositive({
    message: 'Height must be greater than zero'
  })
  height: number;

}