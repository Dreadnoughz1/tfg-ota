import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AlertsService } from './alert.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  /**
   * 🔎 Obtener todas las alertas de una máquina
   * Ejemplo:
   * GET /alerts/machine/1
   */
  @Get('machine/:machineId')
  getAlertsByMachine(@Param('machineId', ParseIntPipe) machineId: number) {
    return this.alertsService.findByMachine(machineId);
  }

  /**
   * 🔥 Obtener alertas filtradas por severidad
   * Ejemplo:
   * GET /alerts/machine/1?severity=critical
   */
  @Get('machine/:machineId/filter')
  getAlertsByMachineFiltered(
    @Param('machineId', ParseIntPipe) machineId: number,
    @Query('severity') severity?: 'warning' | 'critical',
  ) {
    return this.alertsService.findByMachine(machineId, severity);
  }

  /**
   * 🕒 Obtener las últimas N alertas del sistema
   * Ejemplo:
   * GET /alerts/latest?limit=20
   */
  @Get('latest')
  getLatestAlerts(@Query('limit') limit = 10) {
    return this.alertsService.findLatest(Number(limit));
  }
}
