import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertRule } from './entities/alert-rule.entity';
import { Alert } from './entities/alert.entity';
import { Machine } from '../machines/entities/machine.entity';
import { AlertsGateway } from 'src/alerts/alerts.gateway';
import { NotFoundException } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { CreateAlertRuleDto } from './dto/create-alert-rule.dto';

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

  findRules() { return this.ruleRepo.find({ relations: ['machine'], order: { id: 'DESC' } }); }

  async createRule(dto: CreateAlertRuleDto) {
    const { machineId, ...ruleData } = dto;
    const machine = await this.getMachine(machineId);
    return this.ruleRepo.save(this.ruleRepo.create({ ...ruleData, machine }));
  }

  async removeRule(id: number) {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) throw new NotFoundException(`Regla con ID ${id} no encontrada.`);
    await this.ruleRepo.remove(rule);
  }

  async createAlert(dto: CreateAlertDto) {
    const { machineId, ...alertData } = dto;
    const machine = await this.getMachine(machineId);
    return this.alertRepo.save(this.alertRepo.create({ ...alertData, machine }));
  }

  async updateAlert(id: number, dto: Partial<CreateAlertDto>) {
    const alert = await this.alertRepo.findOne({ where: { id }, relations: ['machine'] });
    if (!alert) throw new NotFoundException(`Alerta con ID ${id} no encontrada.`);
    if (dto.machineId) alert.machine = await this.getMachine(dto.machineId);
    Object.assign(alert, dto);
    return this.alertRepo.save(alert);
  }

  async removeAlert(id: number) {
    const alert = await this.alertRepo.findOne({ where: { id } });
    if (!alert) throw new NotFoundException(`Alerta con ID ${id} no encontrada.`);
    await this.alertRepo.remove(alert);
  }

  private async getMachine(id: number) {
    const machine = await this.alertRepo.manager.getRepository(Machine).findOne({ where: { id } });
    if (!machine) throw new NotFoundException(`Máquina con ID ${id} no encontrada.`);
    return machine;
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
