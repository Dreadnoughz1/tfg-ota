import { Test, TestingModule } from '@nestjs/testing';
import { AttributeValuesController } from './attribute-values.controller';
import { AttributeValuesService } from './attribute-values.service';

describe('AttributeValuesController', () => {
  let controller: AttributeValuesController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    findLatestByMachine: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findLatestByMachine: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributeValuesController],
      providers: [
        {
          provide: AttributeValuesService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<AttributeValuesController>(
      AttributeValuesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create debe delegar en service.create', async () => {
    const dto: any = { attributeName: 'temp', value: 80 };
    service.create.mockResolvedValue({ id: 1, ...dto });
    const res = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(res).toHaveProperty('id', 1);
  });

  it('findLatestByMachine debe devolver los últimos atributos', async () => {
    service.findLatestByMachine.mockResolvedValue([{ attributeName: 'temp', value: 80 }]);
    const res = await controller.getLatestValues(1);
    expect(service.findLatestByMachine).toHaveBeenCalledWith(1);
    expect(res).toHaveLength(1);
  });

  it('findOne debe delegar en service.findOne', async () => {
    service.findOne.mockResolvedValue({ id: 1 });
    const res = await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual({ id: 1 });
  });

  it('remove debe delegar en service.remove', async () => {
    service.remove.mockResolvedValue(undefined);
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
