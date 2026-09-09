import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AttributeValuesService } from './attribute-values.service';
import { AttributeValue } from './entities/attribute-value.entity';

describe('AttributeValuesService', () => {
  let service: AttributeValuesService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    delete: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn((dto) => dto),
      save: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
      findOne: jest.fn(),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttributeValuesService,
        { provide: getRepositoryToken(AttributeValue), useValue: repo },
      ],
    }).compile();

    service = module.get<AttributeValuesService>(AttributeValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear y guardar un valor de atributo', async () => {
      const dto: any = {
        attributeName: 'temperature',
        value: 85,
        timestamp: new Date(),
        machineId: 1,
        gatewayId: 1,
        connectorId: 1,
        lifeBit: true,
        connexionStatus: 'alive',
      };

      const res = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalled();
      expect(res).toHaveProperty('attributeName', 'temperature');
    });
  });

  describe('findOne', () => {
    it('debe devolver el registro si existe', async () => {
      repo.findOne.mockResolvedValue({ id: 1, attributeName: 'temp' });
      const res = await service.findOne(1);
      expect(res).toEqual({ id: 1, attributeName: 'temp' });
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findLatestByMachine', () => {
    it('debe devolver la lista de últimos atributos mapeados', async () => {
      const qb: any = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        distinctOn: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { av_attributeName: 'temperature', av_value: 95.2, av_timestamp: '2026-07-26' },
        ]),
      };
      repo.createQueryBuilder.mockReturnValue(qb);

      const res = await service.findLatestByMachine(1);
      expect(res).toEqual([
        { attributeName: 'temperature', value: 95.2, timestamp: '2026-07-26' },
      ]);
    });
  });

  describe('remove', () => {
    it('debe eliminar el registro si existe', async () => {
      repo.findOne.mockResolvedValue({ id: 1 });
      await service.remove(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });
});
