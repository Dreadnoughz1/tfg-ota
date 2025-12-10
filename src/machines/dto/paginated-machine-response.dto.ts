import { Machine } from '../entities/machine.entity';

export class PaginatedMachineResponseDto {
  machines: Machine[];
  total: number;
}
