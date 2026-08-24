import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateGatewayDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @IsInt({ each: true })
  connectorsId: number[];

  @IsArray()
  @IsInt({ each: true })
  machinesId: number[];
}
