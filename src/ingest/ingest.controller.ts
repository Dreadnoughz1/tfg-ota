import { Body, Controller, Post } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestHierarchyDto } from './dto';

@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post('attributes')
  async ingestAttributes(@Body() dto: IngestHierarchyDto) {
    return this.ingestService.ingest(dto);
  }
}
