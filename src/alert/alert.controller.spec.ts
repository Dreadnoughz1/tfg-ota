import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alert.controller';
import { AlertsService } from './alert.service';

describe('AlertsController', () => {
  let controller: AlertsController;
  let alertsService: {
    findByMachine: jest.Mock;
    findLatest: jest.Mock;
    createAlert: jest.Mock;
    updateAlert: jest.Mock;
    removeAlert: jest.Mock;
    findRules: jest.Mock;
    createRule: jest.Mock;
    removeRule: jest.Mock;
  };

  beforeEach(async () => {
    alertsService = {
      findByMachine: jest.fn(),
      findLatest: jest.fn(),
      createAlert: jest.fn(),
      updateAlert: jest.fn(),
      removeAlert: jest.fn(),
      findRules: jest.fn(),
      createRule: jest.fn(),
      removeRule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [
        {
          provide: AlertsService,
          useValue: alertsService,
        },
      ],
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAlertsByMachine debe llamar a findByMachine', async () => {
    alertsService.findByMachine.mockResolvedValue([]);
    await controller.getAlertsByMachine(1);
    expect(alertsService.findByMachine).toHaveBeenCalledWith(1);
  });

  it('getAlertsByMachineFiltered debe filtrar por severidad', async () => {
    alertsService.findByMachine.mockResolvedValue([]);
    await controller.getAlertsByMachineFiltered(1, 'critical');
    expect(alertsService.findByMachine).toHaveBeenCalledWith(1, 'critical');
  });

  it('getLatestAlerts debe llamar a findLatest con limit', async () => {
    alertsService.findLatest.mockResolvedValue([]);
    await controller.getLatestAlerts(5);
    expect(alertsService.findLatest).toHaveBeenCalledWith(5);
  });

  it('createAlert debe llamar a createAlert del servicio', async () => {
    const dto: any = { attributeName: 'temp', value: 90, threshold: 80, operator: '>', severity: 'critical', machineId: 1, timestamp: new Date() };
    alertsService.createAlert.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.createAlert(dto);
    expect(alertsService.createAlert).toHaveBeenCalledWith(dto);
    expect(result).toHaveProperty('id', 1);
  });

  it('getRules y createRule deben interactuar con el servicio', async () => {
    alertsService.findRules.mockResolvedValue([]);
    await controller.getRules();
    expect(alertsService.findRules).toHaveBeenCalled();

    const ruleDto: any = { attributeName: 'temp', operator: '>', threshold: 80, severity: 'warning', machineId: 1 };
    alertsService.createRule.mockResolvedValue({ id: 1, ...ruleDto });
    await controller.createRule(ruleDto);
    expect(alertsService.createRule).toHaveBeenCalledWith(ruleDto);
  });

  it('deleteRule debe llamar a removeRule', async () => {
    alertsService.removeRule.mockResolvedValue(undefined);
    await controller.deleteRule(1);
    expect(alertsService.removeRule).toHaveBeenCalledWith(1);
  });
});
