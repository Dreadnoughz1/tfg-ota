import { Gateway } from 'src/gateways/entities/gateway.entity';
import { Machine } from 'src/machines/entities/machine.entity';

export class CreateConnectorDto {
  id: number;
  name: string;
  portName: string;
  gateway: Gateway;
  machines: Machine[];
}
