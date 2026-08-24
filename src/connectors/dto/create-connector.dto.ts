import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateConnectorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  portName: string;

  @IsInt()
  gatewayId: number;

  @IsArray()
  @IsInt({ each: true })
  machinesId: number[];
}
