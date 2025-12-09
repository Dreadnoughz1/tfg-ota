import { Machine } from "src/backend/entities";

export class CreateAttributeValueDto {
  id: number;
  attributeName: string;
  value: number;
  timestamp: Date;
  machine: Machine;
}
