import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Machine } from './entities/machine.entity';
import { Connector } from 'src/connectors/entities/connector.entity';
import { Gateway } from 'src/gateways/entities/gateway.entity';

describe('MachinesService', () => {
  let service: MachinesService;
  let machineRepo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    delete: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  let connectorRepo: { findOne: jest.Mock };
  let gatewayRepo: { findOne: jest.Mock };

  beforeEach(async () => {
    machineRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
      findOne: jest.fn(),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn(),
    };
    connectorRepo = { findOne: jest.fn() };
    gatewayRepo = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachinesService,
        { provide: getRepositoryToken(Machine), useValue: machineRepo },
        { provide: getRepositoryToken(Connector), useValue: connectorRepo },
        { provide: getRepositoryToken(Gateway), useValue: gatewayRepo },
      ],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear una máquina asociando su conector y gateway', async () => {
      connectorRepo.findOne.mockResolvedValue({ id: 2, name: 'C1' });
      gatewayRepo.findOne.mockResolvedValue({ id: 3, name: 'G1' });

      const dto = {
        name: 'M1',
        description: 'D1',
        serial: 'S1',
        model: 'MOD-1',
        connectorId: 2,
        gatewayId: 3,
      };

      const result = await service.create(dto);
      expect(result).toHaveProperty('name', 'M1');
      expect(machineRepo.save).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el conector no existe', async () => {
      connectorRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          name: 'M1',
          description: 'D1',
          serial: 'S1',
          model: 'MOD-1',
          connectorId: 99,
          gatewayId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si el gateway no existe', async () => {
      connectorRepo.findOne.mockResolvedValue({ id: 2 });
      gatewayRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          name: 'M1',
          description: 'D1',
          serial: 'S1',
          model: 'MOD-1',
          connectorId: 2,
          gatewayId: 99,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('debe devolver la máquina si existe', async () => {
      machineRepo.findOne.mockResolvedValue({ id: 1, name: 'M1' });
      const res = await service.findOne(1);
      expect(res).toEqual({ id: 1, name: 'M1' });
    });

    it('debe lanzar NotFoundException si la máquina no existe', async () => {
      machineRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar la máquina si existe', async () => {
      machineRepo.findOne.mockResolvedValue({ id: 1 });
      await service.remove(1);
      expect(machineRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
