import { Connector } from 'src/connectors/entities/connector.entity';

export class CreateGatewayDto {
  name: string;
  location: string;
  connectorsId: number[];
}
