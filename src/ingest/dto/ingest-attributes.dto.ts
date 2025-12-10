import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class IngestAttributeItemDto {
  @IsString()
  @IsNotEmpty()
  attributeName: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsDateString()
  @IsNotEmpty()
  timestamp: string;
}

export class IngestAttributesDto {
  @IsNumber()
  @IsNotEmpty()
  machineId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngestAttributeItemDto)
  attributes: IngestAttributeItemDto[];
}
