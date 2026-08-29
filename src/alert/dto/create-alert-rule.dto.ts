import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlertRuleDto {
  @IsString() @IsNotEmpty() attributeName: string;
  @IsString() @IsIn(['>', '<', '>=', '<=', '=']) operator: '>' | '<' | '>=' | '<=' | '=';
  @IsNumber() threshold: number;
  @IsString() @IsIn(['warning', 'critical']) severity: 'warning' | 'critical';
  @IsInt() machineId: number;
}
