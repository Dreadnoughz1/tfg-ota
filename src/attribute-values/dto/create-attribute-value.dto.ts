import { Machine } from 'src/machines/entities/machine.entity';

export class CreateAttributeValueDto {
  id: number;
  attributeName: string;
  value: number;
  timestamp: Date;
  machine: Machine;
}
