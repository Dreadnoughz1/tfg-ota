import { Module } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { IngestController } from './ingest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from '../machines/entities/machine.entity';
import { AttributeValue } from '../attribute-values/entities/attribute-value.entity';
import { Connector } from 'src/connectors/entities/connector.entity';
import { Gateway } from 'src/gateways/entities/gateway.entity';
import { AlertModule } from 'src/alert/alert.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Machine, AttributeValue, Connector, Gateway]),
    AlertModule,
  ],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
