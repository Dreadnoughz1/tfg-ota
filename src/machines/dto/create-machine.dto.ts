export class CreateMachineDto {
  name: string;
  description: string;
  serial: string;
  model: string;
  connectorId: number;
  gatewayId: number;
}
