import { Module } from '@nestjs/common';
import { AlertsService } from './alert.service';
import { AlertsController } from './alert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { AlertRule } from './entities/alert-rule.entity';

@Module({
  controllers: [AlertsController],
  providers: [AlertsService],
  imports: [AlertModule, TypeOrmModule.forFeature([AlertRule, Alert])],
  exports: [AlertsService],
})
export class AlertModule {}
