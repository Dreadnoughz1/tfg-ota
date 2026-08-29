import { IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsString() @IsNotEmpty() attributeName: string;
  @IsNumber() value: number;
  @IsNumber() threshold: number;
  @IsString() @IsIn(['>', '<', '>=', '<=', '=']) operator: string;
  @IsString() @IsIn(['warning', 'critical']) severity: string;
  @IsDateString() timestamp: Date;
  @IsInt() machineId: number;
}
