import { Module } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { ConnectorsController } from './connectors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connector } from './entities/connector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Connector])],
  controllers: [ConnectorsController],
  providers: [ConnectorsService],
})
export class ConnectorsModule {}
