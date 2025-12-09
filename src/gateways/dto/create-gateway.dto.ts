import { Connector } from 'src/connectors/entities/connector.entity';

export class CreateGatewayDto {
  id: number;
  name: string;
  location: string;
  connectors: Connector[];
}
