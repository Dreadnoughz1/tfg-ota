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
    const where = {
      machine: { id: machineId },
      severity: severity ? severity : undefined,
    };

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
    // este método evalúa los valores de los atributos que se reciben y comprueba si se sobrepasa algún umbral. Si es así, crea una alerta y la emite a través de la gateway
    //todo: En vez de emitirla así debo hacer que el front-end reciba notificaciones con los valores, umbral superado y máquina.
    // El usuario debe poder suscribirse a las máquinas que quiera
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
