import { Module, forwardRef } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { ConnectorsController } from './connectors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connector } from './entities/connector.entity';
import { GatewaysModule } from 'src/gateways/gateways.module';
import { MachinesModule } from 'src/machines/machines.module';

@Module({
  controllers: [ConnectorsController],
  providers: [ConnectorsService],
  imports: [
    TypeOrmModule.forFeature([Connector]),
    GatewaysModule,
    forwardRef(() => MachinesModule),
  ],
  exports: [TypeOrmModule, ConnectorsService],
})
export class ConnectorsModule {}
