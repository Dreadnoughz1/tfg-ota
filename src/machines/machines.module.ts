import { forwardRef, Module } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './entities/machine.entity';
import { ConnectorsModule } from 'src/connectors/connectors.module';
import { GatewaysModule } from 'src/gateways/gateways.module';

@Module({
  controllers: [MachinesController],
  providers: [MachinesService],
  imports: [
    TypeOrmModule.forFeature([Machine]),
    forwardRef(() => ConnectorsModule),
    GatewaysModule,
  ],
  exports: [TypeOrmModule, MachinesService],
})
export class MachinesModule {}
