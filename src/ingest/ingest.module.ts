import { Module } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestController } from './ingest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from '../machines/entities/machine.entity';
import { AttributeValue } from '../attribute-values/entities/attribute-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Machine, AttributeValue])],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
