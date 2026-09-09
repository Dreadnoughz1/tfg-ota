import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { Connector } from './entities/connector.entity';
import { Gateway } from 'src/gateways/entities/gateway.entity';
import { Machine } from 'src/machines/entities/machine.entity';

describe('ConnectorsService', () => {
  let service: ConnectorsService;
  let connectorRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    delete: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  let gatewayRepo: { findOne: jest.Mock };
  let machineRepo: { findOne: jest.Mock };

  beforeEach(async () => {
    connectorRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
      findOne: jest.fn(),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn(),
    };
    gatewayRepo = { findOne: jest.fn() };
    machineRepo = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectorsService,
        { provide: getRepositoryToken(Connector), useValue: connectorRepo },
        { provide: getRepositoryToken(Gateway), useValue: gatewayRepo },
        { provide: getRepositoryToken(Machine), useValue: machineRepo },
      ],
    }).compile();

    service = module.get<ConnectorsService>(ConnectorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un conector asignando su gateway', async () => {
      gatewayRepo.findOne.mockResolvedValue({ id: 1, name: 'G1' });
      machineRepo.findOne.mockResolvedValue({ id: 10, name: 'M1' });

      const dto = {
        name: 'Conector 1',
        portName: 'COM1',
        gatewayId: 1,
        machinesId: [10],
      };

      const result = await service.create(dto);
      expect(result).toHaveProperty('name', 'Conector 1');
      expect(connectorRepo.save).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el gateway no existe', async () => {
      gatewayRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          name: 'C1',
          portName: 'COM1',
          gatewayId: 99,
          machinesId: [],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('debe devolver el conector si existe', async () => {
      connectorRepo.findOne.mockResolvedValue({ id: 1, name: 'C1' });
      const res = await service.findOne(1);
      expect(res).toEqual({ id: 1, name: 'C1' });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      connectorRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar el conector si existe', async () => {
      connectorRepo.findOne.mockResolvedValue({ id: 1 });
      await service.remove(1);
      expect(connectorRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
