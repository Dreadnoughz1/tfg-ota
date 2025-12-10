import { Body, Controller, Post } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestAttributesDto } from './dto';

@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post('attributes')
  async ingestAttributes(@Body() dto: IngestAttributesDto) {
    return this.ingestService.ingest(dto);
  }
}
