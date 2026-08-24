import { Module } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { Gateway } from './entities/gateway.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connector } from 'src/connectors/entities/connector.entity';
import { Machine } from 'src/machines/entities/machine.entity';

@Module({
  controllers: [GatewaysController],
  providers: [GatewaysService],
  imports: [TypeOrmModule.forFeature([Gateway, Machine, Connector])],
  exports: [TypeOrmModule],
})
export class GatewaysModule {}
