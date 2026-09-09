import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { IngestService } from './ingest.service';
import { Machine } from '../machines/entities/machine.entity';
import { AttributeValue } from '../attribute-values/entities/attribute-value.entity';
import { Gateway } from 'src/gateways/entities/gateway.entity';
import { Connector } from 'src/connectors/entities/connector.entity';
import { AlertsService } from 'src/alert/alert.service';
import { IngestHierarchyDto } from './dto';

describe('IngestService (Casos de prueba CP-03, CP-04, CP-05, CP-07 de la memoria)', () => {
  let service: IngestService;
  let machineRepo: { findOne: jest.Mock };
  let attributeValueRepo: { create: jest.Mock; save: jest.Mock };
  let gatewayRepo: { findOne: jest.Mock };
  let connectorRepo: { findOne: jest.Mock };
  let alertsService: { evaluate: jest.Mock };

  const mockGateway = { id: 1, name: 'Gateway 1', location: 'Nave A' } as Gateway;
  const mockConnector = { id: 1, name: 'Connector 1', portName: 'COM1', gateway: mockGateway } as Connector;
  const mockMachine = { id: 1, name: 'Machine 1', connector: mockConnector, gateway: mockGateway } as Machine;

  beforeEach(async () => {
    gatewayRepo = { findOne: jest.fn() };
    connectorRepo = { findOne: jest.fn() };
    machineRepo = { findOne: jest.fn() };
    attributeValueRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn((values) => Promise.resolve(values)),
    };
    alertsService = {
      evaluate: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestService,
        { provide: getRepositoryToken(Machine), useValue: machineRepo },
        { provide: getRepositoryToken(AttributeValue), useValue: attributeValueRepo },
        { provide: getRepositoryToken(Gateway), useValue: gatewayRepo },
        { provide: getRepositoryToken(Connector), useValue: connectorRepo },
        { provide: AlertsService, useValue: alertsService },
      ],
    }).compile();

    service = module.get<IngestService>(IngestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CP-03: Enviar un lote válido con dos atributos', () => {
    it('debe devolver { status: "ok", inserted: 2 }, persistir métricas preservando fechas e invocar evaluación', async () => {
      gatewayRepo.findOne.mockResolvedValue(mockGateway);
      connectorRepo.findOne.mockResolvedValue(mockConnector);
      machineRepo.findOne.mockResolvedValue(mockMachine);

      const timestampStr1 = '2026-07-26T10:30:00.000Z';
      const timestampStr2 = '2026-07-26T10:30:05.000Z';
      const dto: IngestHierarchyDto = {
        gatewayId: 1,
        connectorId: 1,
        machineId: 1,
        attributes: [
          { attributeName: 'temperature', value: 95.2, timestamp: timestampStr1 },
          { attributeName: 'vibration', value: 8.4, timestamp: timestampStr2 },
        ],
      };

      const response = await service.ingest(dto);

      expect(response).toEqual({ status: 'ok', inserted: 2 });
      expect(attributeValueRepo.save).toHaveBeenCalledTimes(1);
      expect(attributeValueRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          attributeName: 'temperature',
          value: 95.2,
          timestamp: timestampStr1,
          machineId: 1,
          gatewayId: 1,
          connectorId: 1,
          lifeBit: true,
          connexionStatus: 'alive',
        }),
      );
      expect(attributeValueRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          attributeName: 'vibration',
          value: 8.4,
          timestamp: timestampStr2,
          machineId: 1,
          gatewayId: 1,
          connectorId: 1,
          lifeBit: true,
          connexionStatus: 'alive',
        }),
      );
      expect(alertsService.evaluate).toHaveBeenCalledTimes(2);
      expect(alertsService.evaluate).toHaveBeenCalledWith(
        mockMachine,
        'temperature',
        95.2,
        new Date(timestampStr1),
      );
      expect(alertsService.evaluate).toHaveBeenCalledWith(
        mockMachine,
        'vibration',
        8.4,
        new Date(timestampStr2),
      );
    });
  });

  describe('CP-04 y CP-05: Ingesta con delegación en evaluación de umbrales', () => {
    it('CP-04 / CP-05: debe registrar la métrica e invocar la evaluación en AlertsService', async () => {
      gatewayRepo.findOne.mockResolvedValue(mockGateway);
      connectorRepo.findOne.mockResolvedValue(mockConnector);
      machineRepo.findOne.mockResolvedValue(mockMachine);

      const dto: IngestHierarchyDto = {
        gatewayId: 1,
        connectorId: 1,
        machineId: 1,
        attributes: [
          { attributeName: 'temperature', value: 70, timestamp: '2026-07-26T10:00:00.000Z' },
        ],
      };

      const res = await service.ingest(dto);
      expect(res).toEqual({ status: 'ok', inserted: 1 });
      expect(attributeValueRepo.save).toHaveBeenCalled();
      expect(alertsService.evaluate).toHaveBeenCalledWith(
        mockMachine,
        'temperature',
        70,
        expect.any(Date),
      );
    });
  });

  describe('CP-07: Enviar una jerarquía no válida', () => {
    it('debe rechazar con NotFoundException (404) si el gateway no existe y no persistir datos', async () => {
      gatewayRepo.findOne.mockResolvedValue(null);

      const dto: IngestHierarchyDto = {
        gatewayId: 999,
        connectorId: 1,
        machineId: 1,
        attributes: [{ attributeName: 'temp', value: 20, timestamp: '2026-01-01' }],
      };

      await expect(service.ingest(dto)).rejects.toThrow(new NotFoundException('Gateway not found'));
      expect(attributeValueRepo.save).not.toHaveBeenCalled();
      expect(alertsService.evaluate).not.toHaveBeenCalled();
    });

    it('debe rechazar con NotFoundException (404) si el conector no existe o no pertenece al gateway', async () => {
      gatewayRepo.findOne.mockResolvedValue(mockGateway);
      connectorRepo.findOne.mockResolvedValue(null);

      const dto: IngestHierarchyDto = {
        gatewayId: 1,
        connectorId: 999,
        machineId: 1,
        attributes: [{ attributeName: 'temp', value: 20, timestamp: '2026-01-01' }],
      };

      await expect(service.ingest(dto)).rejects.toThrow(
        new NotFoundException('Connector not found or not linked to gateway'),
      );
      expect(attributeValueRepo.save).not.toHaveBeenCalled();
      expect(alertsService.evaluate).not.toHaveBeenCalled();
    });

    it('debe rechazar con NotFoundException (404) si la máquina no existe o no pertenece al conector', async () => {
      gatewayRepo.findOne.mockResolvedValue(mockGateway);
      connectorRepo.findOne.mockResolvedValue(mockConnector);
      machineRepo.findOne.mockResolvedValue(null);

      const dto: IngestHierarchyDto = {
        gatewayId: 1,
        connectorId: 1,
        machineId: 999,
        attributes: [{ attributeName: 'temp', value: 20, timestamp: '2026-01-01' }],
      };

      await expect(service.ingest(dto)).rejects.toThrow(
        new NotFoundException('Machine not found or not linked to connector'),
      );
      expect(attributeValueRepo.save).not.toHaveBeenCalled();
      expect(alertsService.evaluate).not.toHaveBeenCalled();
    });
  });
});
