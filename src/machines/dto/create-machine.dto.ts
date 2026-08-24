import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  serial: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  connectorId: number;

  @IsInt()
  gatewayId: number;
}
