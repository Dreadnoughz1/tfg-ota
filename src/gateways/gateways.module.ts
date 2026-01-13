import { Module } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { Gateway } from './entities/gateway.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [GatewaysController],
  providers: [GatewaysService],
  imports: [TypeOrmModule.forFeature([Gateway])],
  exports: [TypeOrmModule],
})
export class GatewaysModule {}
