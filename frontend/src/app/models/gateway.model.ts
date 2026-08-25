import { Connector } from './connector.model';
import { Machine } from './machine.model';

export interface Gateway {
  id: number;
  name: string;
  location: string;
  connectors?: Connector[];
  machines?: Machine[];
}
