import { Connector } from 'src/connectors/entities/connector.entity';

export class CreateMachineDto {
  description: string;
  serial: string;
  model: string;
  connector: Connector;
}
