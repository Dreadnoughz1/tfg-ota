export class CreateConnectorDto {
  id: number;
  name: string;
  portName: string;
  gatewayId: number;
  machinesId: number[];
}
