import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AlertsService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { CreateAlertRuleDto } from './dto/create-alert-rule.dto';

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
  @Get('machine/filter/:machineId')
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

  @Post()
  createAlert(@Body() dto: CreateAlertDto) { return this.alertsService.createAlert(dto); }

  @Patch(':id')
  updateAlert(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateAlertDto>) { return this.alertsService.updateAlert(id, dto); }

  @Delete(':id')
  deleteAlert(@Param('id', ParseIntPipe) id: number) { return this.alertsService.removeAlert(id); }

  @Get('rules')
  getRules() { return this.alertsService.findRules(); }

  @Post('rules')
  createRule(@Body() dto: CreateAlertRuleDto) { return this.alertsService.createRule(dto); }

  @Delete('rules/:id')
  deleteRule(@Param('id', ParseIntPipe) id: number) { return this.alertsService.removeRule(id); }
}
