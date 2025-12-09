import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttributeValue } from './entities/attribute-value.entity';
import { Repository } from 'typeorm';
import {
  CreateAttributeValueDto,
  PaginatedAttributeValueResponseDto,
  UpdateAttributeValueDto,
} from './dto';
import { SearchDto } from 'src/shared/dto';

@Injectable()
export class AttributeValuesService {
  constructor(
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
  ) {}

  async create(createAttributeValueDto: CreateAttributeValueDto) {
    const attributeValue = this.attributeValueRepository.create(
      createAttributeValueDto,
    );
    await this.attributeValueRepository.save(attributeValue);

    return attributeValue;
  }

  async findAll(
    paginationDto: SearchDto,
  ): Promise<PaginatedAttributeValueResponseDto> {
    const { orderBy, order, page, limit, searchText } = paginationDto;

    const queryBuilder =
      this.attributeValueRepository.createQueryBuilder('attributeValue');

    if (searchText) {
      queryBuilder.andWhere('attributeValue.attributeName ILIKE :search', {
        search: `%${searchText}%`,
      });
    }

    const validOrderFields = ['attributeName', 'id'];

    const safeOrderBy = validOrderFields.includes(orderBy)
      ? orderBy
      : 'attributeName';

    queryBuilder.orderBy(`attributeValue.${safeOrderBy}`, order);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      attribueValues: data,
      total: total,
    };
  }

  async findOne(id: number) {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: { id },
    });

    if (!attributeValue) {
      throw new NotFoundException(`Valor con ID ${id} no encontrado.`);
    }

    return attributeValue;
  }

  async update(id: number, updateAttributeValueDto: UpdateAttributeValueDto) {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: { id: id },
    });

    if (!attributeValue) {
      throw new NotFoundException(`Valor con ID ${id} no encontrado.`);
    }
    Object.assign(attributeValue, updateAttributeValueDto);

    await this.attributeValueRepository.save(attributeValue);

    return attributeValue;
  }

  async remove(id: number) {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: { id },
    });
    if (!attributeValue)
      throw new NotFoundException(`Valor con ID ${id} no encontrado.`);

    await this.attributeValueRepository.delete(id);
  }
}
