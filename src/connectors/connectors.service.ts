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

@Injectable()
export class ConnectorsService {
  constructor(
    @InjectRepository(Connector)
    private readonly connectorRepository: Repository<Connector>,
  ) {}
  async create(createConnectorDto: CreateConnectorDto) {
    const connector = this.connectorRepository.create(createConnectorDto);

    await this.connectorRepository.save(connector);

    return connector;
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
    Object.assign(connector, updateConnectorDto);

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
