import { Module } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { ConnectorsController } from './connectors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connector } from './entities/connector.entity';

@Module({
  controllers: [ConnectorsController],
  providers: [ConnectorsService],
  imports: [TypeOrmModule.forFeature([Connector])],
  exports: [TypeOrmModule],
})
export class ConnectorsModule {}
