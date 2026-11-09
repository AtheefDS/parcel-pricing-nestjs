import { IsDefined, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { ParcelCategory } from '../parcel-category.enum';

const num = { allowNaN: false, allowInfinity: false };

export class PricingRequestDto {
  @IsDefined({ message: 'Parcel category is required' })
  @IsEnum(ParcelCategory)
  category: ParcelCategory;

  @IsDefined({ message: 'Weight is required' })
  @IsNumber(num)
  @IsPositive({ message: 'Weight must be greater than zero' })
  weight: number;

  @IsDefined({ message: 'Length is required' })
  @IsNumber(num)
  @IsPositive({ message: 'Length must be greater than zero' })
  length: number;

  @IsDefined({ message: 'Width is required' })
  @IsNumber(num)
  @IsPositive({ message: 'Width must be greater than zero' })
  width: number;

  @IsDefined({ message: 'Height is required' })
  @IsNumber(num)
  @IsPositive({ message: 'Height must be greater than zero' })
  height: number;
}
