export interface AttributeValue {
  id: number;
  attributeName: string;
  value: number;
  timestamp: Date;
  machineId: number;
  gatewayId: number;
  connectorId: number;
  lifeBit: boolean;
  connexionStatus: string;
}
