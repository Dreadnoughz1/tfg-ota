import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from '../machines/entities/machine.entity';
import { AttributeValue } from '../attribute-values/entities/attribute-value.entity';
import { IngestAttributesDto } from './dto';

@Injectable()
export class IngestService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,

    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
  ) {}

  async ingest(dto: IngestAttributesDto) {
    const machine = await this.machineRepository.findOne({
      where: { id: dto.machineId },
    });

    if (!machine) {
      throw new NotFoundException(`Machine with ID ${dto.machineId} not found`);
    }

    const attributeValues = dto.attributes.map((attr) =>
      this.attributeValueRepository.create({
        attributeName: attr.attributeName,
        value: attr.value,
        timestamp: attr.timestamp,
        machine: machine,
      }),
    );

    await this.attributeValueRepository.save(attributeValues);

    return { success: true, received: attributeValues.length };
  }
}
