import { Gateway } from '../entities/gateway.entity';

export class PaginatedGatewayResponseDto {
  gateways: Gateway[];
  total: number;
}
