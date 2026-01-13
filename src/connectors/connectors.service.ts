import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateConnectorDto,
  PaginatedConnectorResponseDto,
  UpdateConnectorDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connector } from './entities/connector.entity';
import { Repository } from 'typeorm';
import { SearchDto } from 'src/shared/dto';
import { Gateway } from 'src/gateways/entities/gateway.entity';
import { Machine } from 'src/machines/entities/machine.entity';

@Injectable()
export class ConnectorsService {
  constructor(
    @InjectRepository(Connector)
    private readonly connectorRepository: Repository<Connector>,

    @InjectRepository(Gateway)
    private readonly gatewayRepository: Repository<Gateway>,

    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
  ) {}
  async create(createConnectorDto: CreateConnectorDto) {
    const connector = this.connectorRepository.create(createConnectorDto);

    const gateway = await this.gatewayRepository.findOne({
      where: { id: createConnectorDto.gatewayId },
    });

    if (!gateway) {
      throw new NotFoundException(
        `Gateway con ID ${createConnectorDto.gatewayId} no encontrado.`,
      );
    }

    const machines: Machine[] = [];
    for (const machineId of createConnectorDto.machinesId) {
      const machine = await this.machineRepository.findOne({
        where: { id: machineId },
      });
      if (!machine) {
        throw new NotFoundException(
          `Máquina con ID ${machineId} no encontrada.`,
        );
      }
      machines.push(machine);
    }
    const response = { ...connector, gateway: gateway, machines: machines };
    await this.connectorRepository.save(response);

    return response;
  }

  async findAll(
    paginationDto: SearchDto,
  ): Promise<PaginatedConnectorResponseDto> {
    const { orderBy, order, page, limit, searchText } = paginationDto;

    const queryBuilder =
      this.connectorRepository.createQueryBuilder('connector');

    if (searchText) {
      queryBuilder.andWhere('connector.name ILIKE :search', {
        search: `%${searchText}%`,
      });
    }

    const validOrderFields = ['name', 'id'];

    const safeOrderBy = validOrderFields.includes(orderBy) ? orderBy : 'name';

    queryBuilder.orderBy(`connector.${safeOrderBy}`, order);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      connectors: data,
      total: total,
    };
  }

  async findOne(id: number) {
    const connector = await this.connectorRepository.findOne({
      where: { id },
    });

    if (!connector) {
      throw new NotFoundException(`Conector con ID ${id} no encontrado.`);
    }

    return connector;
  }

  async update(id: number, updateConnectorDto: UpdateConnectorDto) {
    const connector = await this.connectorRepository.findOne({
      where: { id: id },
    });

    if (!connector) {
      throw new NotFoundException(`Conector con ID ${id} no encontrado.`);
    }
    const { machinesId, gatewayId, ...rest } = updateConnectorDto;

    if (
      connector.gateway.id !== undefined &&
      connector.gateway.id !== gatewayId
    ) {
      const gateway = await this.gatewayRepository.findOne({
        where: { id: gatewayId },
      });

      if (!gateway) {
        throw new NotFoundException('Conector no encontrado');
      }

      connector.gateway = gateway;
    }

    if (machinesId !== undefined) {
      for (const machineId of machinesId) {
        if (
          machineId !== null &&
          !connector.machines.find((m) => m.id === machineId)
        ) {
          const machine = await this.machineRepository.findOne({
            where: { id: machineId },
          });

          if (!machine) {
            throw new NotFoundException('Máquina no encontrada');
          }

          connector.machines.push(machine);
        }
      }
    }

    Object.assign(connector, rest);

    await this.connectorRepository.save(connector);

    return connector;
  }

  async remove(id: number) {
    const connector = await this.connectorRepository.findOne({
      where: { id },
    });
    if (!connector)
      throw new NotFoundException(`Conector con ID ${id} no encontrado.`);

    await this.connectorRepository.delete(id);
  }
}
