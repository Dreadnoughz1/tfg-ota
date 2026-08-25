export interface Machine {
  id: number;
  name: string;
  description: string;
  serial: string;
  model: string;
  connector?: { id: number; name?: string };
  connectorId?: number;
  gateway?: { id: number; name?: string };
  gatewayId?: number;
}
