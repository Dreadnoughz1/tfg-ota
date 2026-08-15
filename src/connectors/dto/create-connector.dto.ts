export class CreateConnectorDto {
  name: string;
  portName: string;
  gatewayId: number;
  machinesId: number[];
}
