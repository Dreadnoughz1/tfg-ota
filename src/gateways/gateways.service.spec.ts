import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { Gateway } from './entities/gateway.entity';
import { Connector } from 'src/connectors/entities/connector.entity';
import { Machine } from 'src/machines/entities/machine.entity';

describe('GatewaysService', () => {
  let service: GatewaysService;
  let gatewayRepository: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    delete: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  let connectorRepository: { findOne: jest.Mock };
  let machineRepository: { findOne: jest.Mock };

  beforeEach(async () => {
    gatewayRepository = {
      create: jest.fn((dto) => dto),
      save: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
      findOne: jest.fn(),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn(),
    };
    connectorRepository = { findOne: jest.fn() };
    machineRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewaysService,
        { provide: getRepositoryToken(Gateway), useValue: gatewayRepository },
        { provide: getRepositoryToken(Connector), useValue: connectorRepository },
        { provide: getRepositoryToken(Machine), useValue: machineRepository },
      ],
    }).compile();

    service = module.get<GatewaysService>(GatewaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un gateway con conectores y máquinas', async () => {
      connectorRepository.findOne.mockResolvedValue({ id: 10 });
      machineRepository.findOne.mockResolvedValue({ id: 20 });

      const dto = {
        name: 'Gateway Principal',
        location: 'Planta 1',
        connectorsId: [10],
        machinesId: [20],
      };

      const result = await service.create(dto);
      expect(result).toHaveProperty('name', 'Gateway Principal');
      expect(gatewayRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si un conector no existe', async () => {
      connectorRepository.findOne.mockResolvedValue(null);
      await expect(
        service.create({
          name: 'G1',
          location: 'L1',
          connectorsId: [99],
          machinesId: [],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('debe devolver el gateway si existe', async () => {
      gatewayRepository.findOne.mockResolvedValue({ id: 1, name: 'G1' });
      const res = await service.findOne(1);
      expect(res).toEqual({ id: 1, name: 'G1' });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      gatewayRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar el gateway', async () => {
      const g = { id: 1, name: 'Viejo', location: 'L1' };
      gatewayRepository.findOne.mockResolvedValue(g);
      const res = await service.update(1, { name: 'Nuevo' });
      expect(res.name).toBe('Nuevo');
      expect(gatewayRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('debe eliminar el gateway si existe', async () => {
      gatewayRepository.findOne.mockResolvedValue({ id: 1 });
      await service.remove(1);
      expect(gatewayRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
