import { Connector } from '../entities/connector.entity';

export class PaginatedConnectorResponseDto {
  connectors: Connector[];
  total: number;
}
