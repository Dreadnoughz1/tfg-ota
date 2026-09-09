import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlertsService } from './alert.service';
import { AlertRule } from './entities/alert-rule.entity';
import { Alert } from './entities/alert.entity';
import { AlertsGateway } from 'src/alerts/alerts.gateway';
import { Machine } from '../machines/entities/machine.entity';
import { NotFoundException } from '@nestjs/common';

describe('AlertsService', () => {
  let service: AlertsService;
  let ruleRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
  };
  let alertRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
    manager: {
      getRepository: jest.Mock;
    };
  };
  let machineRepoMock: {
    findOne: jest.Mock;
  };
  let alertsGateway: {
    emitAlert: jest.Mock;
  };

  const mockMachine = {
    id: 1,
    name: 'Paletizador 1',
    description: 'Paletizador automático',
    serial: 'SN-001',
    model: 'MOD-A',
  } as Machine;

  beforeEach(async () => {
    machineRepoMock = {
      findOne: jest.fn(),
    };

    ruleRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
      remove: jest.fn((rule) => Promise.resolve(rule)),
    };

    alertRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
      remove: jest.fn((alert) => Promise.resolve(alert)),
      manager: {
        getRepository: jest.fn().mockReturnValue(machineRepoMock),
      },
    };

    alertsGateway = {
      emitAlert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        {
          provide: getRepositoryToken(AlertRule),
          useValue: ruleRepository,
        },
        {
          provide: getRepositoryToken(Alert),
          useValue: alertRepository,
        },
        {
          provide: AlertsGateway,
          useValue: alertsGateway,
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluate (Listado 5.11 de la memoria del TFG)', () => {
    it('debe persistir una alerta y emitirla cuando la métrica supera el umbral (temperatura > 80 con valor 95)', async () => {
      const rule: AlertRule = {
        id: 1,
        attributeName: 'temperature',
        operator: '>',
        threshold: 80,
        severity: 'critical',
        machine: mockMachine,
      };

      ruleRepository.find.mockResolvedValue([rule]);

      const testDate = new Date('2026-01-01T00:00:00.000Z');
      await service.evaluate(mockMachine, 'temperature', 95, testDate);

      expect(alertRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          attributeName: 'temperature',
          value: 95,
          threshold: 80,
          severity: 'critical',
        }),
      );
      expect(alertsGateway.emitAlert).toHaveBeenCalledTimes(1);
    });

    it('no debe generar ni emitir alerta cuando la métrica no supera el umbral (temperatura <= 80 con valor 70)', async () => {
      const rule: AlertRule = {
        id: 1,
        attributeName: 'temperature',
        operator: '>',
        threshold: 80,
        severity: 'critical',
        machine: mockMachine,
      };

      ruleRepository.find.mockResolvedValue([rule]);

      await service.evaluate(mockMachine, 'temperature', 70, new Date('2026-01-01'));

      expect(alertRepository.save).not.toHaveBeenCalled();
      expect(alertsGateway.emitAlert).not.toHaveBeenCalled();
    });

    it('debe evaluar correctamente diferentes operadores (<, <=, >=, =)', async () => {
      ruleRepository.find.mockResolvedValue([
        { id: 2, attributeName: 'vibration', operator: '>=', threshold: 8, severity: 'warning', machine: mockMachine },
        { id: 3, attributeName: 'vibration', operator: '<', threshold: 2, severity: 'warning', machine: mockMachine },
        { id: 4, attributeName: 'vibration', operator: '=', threshold: 5, severity: 'warning', machine: mockMachine },
      ]);

      await service.evaluate(mockMachine, 'vibration', 8.5, new Date());
      expect(alertRepository.save).toHaveBeenCalledTimes(1);
      expect(alertRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ threshold: 8, operator: '>=' }),
      );

      jest.clearAllMocks();
      ruleRepository.find.mockResolvedValue([
        { id: 3, attributeName: 'pressure', operator: '<=', threshold: 10, severity: 'critical', machine: mockMachine },
      ]);
      await service.evaluate(mockMachine, 'pressure', 10, new Date());
      expect(alertRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByMachine', () => {
    it('debe buscar alertas por id de máquina', async () => {
      alertRepository.find.mockResolvedValue([{ id: 1 }]);
      const result = await service.findByMachine(1);
      expect(alertRepository.find).toHaveBeenCalledWith({
        where: { machine: { id: 1 }, severity: undefined },
        order: { timestamp: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });

    it('debe filtrar alertas por severidad si se proporciona', async () => {
      alertRepository.find.mockResolvedValue([{ id: 1, severity: 'critical' }]);
      const result = await service.findByMachine(1, 'critical');
      expect(alertRepository.find).toHaveBeenCalledWith({
        where: { machine: { id: 1 }, severity: 'critical' },
        order: { timestamp: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findLatest', () => {
    it('debe devolver las últimas alertas limitadas por parámetro', async () => {
      alertRepository.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const result = await service.findLatest(5);
      expect(alertRepository.find).toHaveBeenCalledWith({
        order: { timestamp: 'DESC' },
        take: 5,
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('findRules', () => {
    it('debe devolver las reglas ordenadas', async () => {
      ruleRepository.find.mockResolvedValue([{ id: 1 }]);
      const result = await service.findRules();
      expect(ruleRepository.find).toHaveBeenCalledWith({
        relations: ['machine'],
        order: { id: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('createRule y removeRule', () => {
    it('debe crear una regla asociándola a la máquina', async () => {
      machineRepoMock.findOne.mockResolvedValue(mockMachine);
      const dto = {
        attributeName: 'temperature',
        operator: '>' as const,
        threshold: 90,
        severity: 'critical' as const,
        machineId: 1,
      };

      const result = await service.createRule(dto);
      expect(machineRepoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(ruleRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
    });

    it('debe lanzar NotFoundException al crear regla si la máquina no existe', async () => {
      machineRepoMock.findOne.mockResolvedValue(null);
      await expect(
        service.createRule({
          attributeName: 'temp',
          operator: '>',
          threshold: 50,
          severity: 'warning',
          machineId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe eliminar una regla existente', async () => {
      const rule = { id: 1 };
      ruleRepository.findOne.mockResolvedValue(rule);
      await service.removeRule(1);
      expect(ruleRepository.remove).toHaveBeenCalledWith(rule);
    });

    it('debe lanzar NotFoundException si la regla a eliminar no existe', async () => {
      ruleRepository.findOne.mockResolvedValue(null);
      await expect(service.removeRule(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createAlert, updateAlert y removeAlert', () => {
    it('debe crear una alerta asignando su máquina', async () => {
      machineRepoMock.findOne.mockResolvedValue(mockMachine);
      const dto = {
        attributeName: 'vibration',
        value: 12,
        threshold: 10,
        operator: '>',
        severity: 'critical' as const,
        timestamp: new Date(),
        machineId: 1,
      };
      const alert = await service.createAlert(dto);
      expect(alert).toHaveProperty('id', 1);
    });

    it('debe actualizar una alerta existente', async () => {
      const alert = { id: 1, attributeName: 'temp' };
      alertRepository.findOne.mockResolvedValue(alert);
      const result = await service.updateAlert(1, { attributeName: 'temp2' });
      expect(alertRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('attributeName', 'temp2');
    });

    it('debe eliminar una alerta existente', async () => {
      const alert = { id: 1 };
      alertRepository.findOne.mockResolvedValue(alert);
      await service.removeAlert(1);
      expect(alertRepository.remove).toHaveBeenCalledWith(alert);
    });
  });
});
