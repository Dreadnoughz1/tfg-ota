import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertRule } from './entities/alert-rule.entity';
import { Alert } from './entities/alert.entity';
import { Machine } from '../machines/entities/machine.entity';
import { AlertsGateway } from 'src/alerts/alerts.gateway';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(AlertRule)
    private readonly ruleRepo: Repository<AlertRule>,
    @InjectRepository(Alert)
    private readonly alertRepo: Repository<Alert>,
    private readonly alertsGateway: AlertsGateway,
  ) {}

  async findByMachine(machineId: number, severity?: 'warning' | 'critical') {
    const where: any = { machine: { id: machineId } };

    if (severity) {
      where.severity = severity;
    }

    return this.alertRepo.find({
      where,
      order: { timestamp: 'DESC' },
    });
  }

  async findLatest(limit = 10) {
    return this.alertRepo.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async evaluate(
    machine: Machine,
    attributeName: string,
    value: number,
    timestamp: Date,
  ) {
    const rules = await this.ruleRepo.find({
      where: { machine: { id: machine.id }, attributeName },
      relations: ['machine'],
    });

    for (const rule of rules) {
      if (this.matches(rule.operator, value, rule.threshold)) {
        const alert = this.alertRepo.create({
          attributeName,
          value,
          threshold: rule.threshold,
          operator: rule.operator,
          severity: rule.severity,
          timestamp,
          machine,
        });

        await this.alertRepo.save(alert);
        this.alertsGateway.emitAlert(alert);
      }
    }
  }

  private matches(op: string, value: number, threshold: number): boolean {
    switch (op) {
      case '>':
        return value > threshold;
      case '<':
        return value < threshold;
      case '>=':
        return value >= threshold;
      case '<=':
        return value <= threshold;
      case '=':
        return value === threshold;
      default:
        return false;
    }
  }
}
