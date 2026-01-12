import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity';
import { SearchDto } from 'src/shared/dto';
import {
  CreateMachineDto,
  PaginatedMachineResponseDto,
  UpdateMachineDto,
} from './dto';
import { Connector } from 'src/connectors/entities/connector.entity';
import { Gateway } from 'src/gateways/entities/gateway.entity';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
    @InjectRepository(Connector)
    private readonly connectorRepository: Repository<Connector>,
    @InjectRepository(Gateway)
    private readonly gatewayRepository: Repository<Gateway>,
  ) {}
  async create(createMachineDto: CreateMachineDto) {
    const machine = this.machineRepository.create(createMachineDto);

    const connector = await this.connectorRepository.findOne({
      where: {
        id: createMachineDto.connectorId,
      },
    });

    if (!connector) {
      throw new NotFoundException('Conector no encontrado.');
    }

    const gateway = await this.gatewayRepository.findOne({
      where: {
        id: createMachineDto.gatewayId,
      },
    });

    if (!gateway) {
      throw new NotFoundException('Gateway no encontrado.');
    }

    const response = { ...machine, connector: connector, gateway: gateway };
    await this.machineRepository.save(response);

    return response;
  }

  async findAll(
    paginationDto: SearchDto,
  ): Promise<PaginatedMachineResponseDto> {
    const { orderBy, order, page, limit, searchText } = paginationDto;

    const queryBuilder = this.machineRepository.createQueryBuilder('machine');

    if (searchText) {
      queryBuilder.andWhere('machine.description ILIKE :search', {
        search: `%${searchText}%`,
      });
    }

    const validOrderFields = ['description', 'id'];

    const safeOrderBy = validOrderFields.includes(orderBy)
      ? orderBy
      : 'description';

    queryBuilder.orderBy(`machine.${safeOrderBy}`, order);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      machines: data,
      total: total,
    };
  }

  async findOne(id: number) {
    const machine = await this.machineRepository.findOne({
      where: { id },
    });

    if (!machine) {
      throw new NotFoundException(`Machine con ID ${id} no encontrado.`);
    }

    return machine;
  }

  async update(id: number, updateMachineDto: UpdateMachineDto) {
    const machine = await this.machineRepository.findOne({
      where: { id: id },
    });

    if (!machine) {
      throw new NotFoundException(`Machine con ID ${id} no encontrado.`);
    }

    const { connectorId, gatewayId, ...rest } = updateMachineDto;

    if (machine.connector.id !== connectorId) {
      const connector = await this.connectorRepository.findOne({
        where: { id: connectorId },
      });

      if (!connector) {
        throw new NotFoundException('Conector no encontrado');
      }

      machine.connector = connector;
    }

    if (machine.gateway.id !== gatewayId) {
      const gateway = await this.gatewayRepository.findOne({
        where: { id: gatewayId },
      });

      if (!gateway) {
        throw new NotFoundException('Gateway no encontrado');
      }

      machine.gateway = gateway;
    }

    Object.assign(machine, rest);

    await this.machineRepository.save(machine);

    return machine;
  }

  async remove(id: number) {
    const machine = await this.machineRepository.findOne({
      where: { id },
    });
    if (!machine)
      throw new NotFoundException(`Machine con ID ${id} no encontrado.`);

    await this.machineRepository.delete(id);
  }
}
