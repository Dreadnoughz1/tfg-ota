import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchDto } from 'src/shared/dto';
import { Repository } from 'typeorm';
import { Gateway } from './entities/gateway.entity';
import {
  CreateGatewayDto,
  PaginatedGatewayResponseDto,
  UpdateGatewayDto,
} from './dto';
import { Connector } from 'src/connectors/entities/connector.entity';

@Injectable()
export class GatewaysService {
  constructor(
    @InjectRepository(Gateway)
    private readonly gatewayRepository: Repository<Gateway>,

    @InjectRepository(Connector)
    private readonly connectorRepository: Repository<Connector>,
  ) {}
  async create(createGatewayDto: CreateGatewayDto) {
    const gateway = this.gatewayRepository.create(createGatewayDto);

    const connectors: Connector[] = [];
    for (const connectorId of createGatewayDto.connectorsId) {
      const connector = await this.connectorRepository.findOne({
        where: { id: connectorId },
      });
      if (!connector) {
        throw new NotFoundException(
          `Conector con ID ${connectorId} no encontrado.`,
        );
      }
      connectors.push(connector);
    }

    const response = { ...gateway, connectors: connectors };

    await this.gatewayRepository.save(response);

    return response;
  }

  async findAll(
    paginationDto: SearchDto,
  ): Promise<PaginatedGatewayResponseDto> {
    console.log('Findign gateways');
    const { orderBy, order, page, limit, searchText } = paginationDto;

    const queryBuilder = this.gatewayRepository.createQueryBuilder('gateway');

    if (searchText) {
      queryBuilder.andWhere('gateway.name ILIKE :search', {
        search: `%${searchText}%`,
      });
    }

    const validOrderFields = ['name', 'id'];

    const safeOrderBy = validOrderFields.includes(orderBy) ? orderBy : 'name';

    queryBuilder.orderBy(`gateway.${safeOrderBy}`, order);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    console.log('returning gateways');
    return {
      gateways: data,
      total: total,
    };
  }

  async findOne(id: number) {
    const gateway = await this.gatewayRepository.findOne({
      where: { id },
    });

    if (!gateway) {
      throw new NotFoundException(`Gateway con ID ${id} no encontrado.`);
    }

    return gateway;
  }

  async update(id: number, updateGatewayDto: UpdateGatewayDto) {
    const gateway = await this.gatewayRepository.findOne({
      where: { id: id },
    });

    if (!gateway) {
      throw new NotFoundException(`Gateway con ID ${id} no encontrado.`);
    }
    Object.assign(gateway, updateGatewayDto);

    await this.gatewayRepository.save(gateway);

    return gateway;
  }

  async remove(id: number) {
    const gateway = await this.gatewayRepository.findOne({
      where: { id },
    });
    if (!gateway)
      throw new NotFoundException(`Gateway con ID ${id} no encontrado.`);

    await this.gatewayRepository.delete(id);
  }
}
