import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from '../machines/entities/machine.entity';
import { AttributeValue } from '../attribute-values/entities/attribute-value.entity';
import { IngestHierarchyDto } from './dto';
import { Gateway } from 'src/gateways/entities/gateway.entity';
import { Connector } from 'src/connectors/entities/connector.entity';

@Injectable()
export class IngestService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(Gateway)
    private readonly gatewayRepository: Repository<Gateway>,
    @InjectRepository(Connector)
    private readonly connectorRepository: Repository<Connector>,
  ) {}

  async ingest(dto: IngestHierarchyDto) {
    const gateway = await this.gatewayRepository.findOne({
      where: { id: dto.gatewayId },
    });

    if (!gateway) {
      throw new NotFoundException('Gateway not found');
    }

    const connector = await this.connectorRepository.findOne({
      where: {
        id: dto.connectorId,
        gateway: { id: gateway.id },
      },
      relations: ['gateway'],
    });

    if (!connector) {
      throw new NotFoundException(
        'Connector not found or not linked to gateway',
      );
    }

    const machine = await this.machineRepository.findOne({
      where: {
        id: dto.machineId,
        connector: { id: connector.id },
      },
      relations: ['connector'],
    });

    if (!machine) {
      throw new NotFoundException(
        'Machine not found or not linked to connector',
      );
    }

    const attributeValues = dto.attributes.map((attr) =>
      this.attributeValueRepository.create({
        attributeName: attr.attributeName,
        value: attr.value,
        timestamp: attr.timestamp,
        machine,
      }),
    );

    await this.attributeValueRepository.save(attributeValues);

    return {
      status: 'ok',
      inserted: attributeValues.length,
    };
  }
}
