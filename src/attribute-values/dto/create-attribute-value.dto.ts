import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateAttributeValueDto {
  @IsString()
  @IsNotEmpty()
  attributeName: string;

  @IsNumber()
  value: number;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsBoolean()
  lifeBit: boolean;

  @IsString()
  @IsNotEmpty()
  connexionStatus: string;

  @IsInt()
  machineId: number;
}
