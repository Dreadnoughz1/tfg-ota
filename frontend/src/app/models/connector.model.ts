import { Machine } from './machine.model';

export interface Connector {
  id: number;
  name: string;
  portName: string;
  gateway?: { id: number; name?: string };
  gatewayId?: number;
  machines?: Machine[];
}
