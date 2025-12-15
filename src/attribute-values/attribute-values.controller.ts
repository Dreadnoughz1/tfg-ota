import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AttributeValuesService } from './attribute-values.service';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { SearchDto } from '../shared/dto/search-attribute-value.dto';

@Controller('attribute-values')
export class AttributeValuesController {
  constructor(
    private readonly attributeValuesService: AttributeValuesService,
  ) {}

  @Post()
  create(@Body() createAttributeValueDto: CreateAttributeValueDto) {
    return this.attributeValuesService.create(createAttributeValueDto);
  }

  @Get()
  findAll(@Query() paginationDto: SearchDto) {
    return this.attributeValuesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributeValuesService.findOne(+id);
  }

  @Get('/machine/:machineId/latest')
  getLatestValues(@Param('machineId', ParseIntPipe) machineId: number) {
    return this.attributeValuesService.findLatestByMachine(machineId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeValueDto: UpdateAttributeValueDto,
  ) {
    return this.attributeValuesService.update(+id, updateAttributeValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributeValuesService.remove(+id);
  }
}
