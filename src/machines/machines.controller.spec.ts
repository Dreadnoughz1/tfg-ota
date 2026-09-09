import { Test, TestingModule } from '@nestjs/testing';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';

describe('MachinesController', () => {
  let controller: MachinesController;
  let machinesService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    machinesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
      providers: [
        {
          provide: MachinesService,
          useValue: machinesService,
        },
      ],
    }).compile();

    controller = module.get<MachinesController>(MachinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create debe delegar en machinesService.create', async () => {
    const dto: any = { name: 'M1', description: 'D', serial: 'S', model: 'M', connectorId: 1, gatewayId: 1 };
    machinesService.create.mockResolvedValue({ id: 1, ...dto });
    const res = await controller.create(dto);
    expect(machinesService.create).toHaveBeenCalledWith(dto);
    expect(res).toHaveProperty('id', 1);
  });

  it('findOne debe delegar en machinesService.findOne', async () => {
    machinesService.findOne.mockResolvedValue({ id: 1 });
    const res = await controller.findOne('1');
    expect(machinesService.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual({ id: 1 });
  });

  it('remove debe delegar en machinesService.remove', async () => {
    machinesService.remove.mockResolvedValue(undefined);
    await controller.remove('1');
    expect(machinesService.remove).toHaveBeenCalledWith(1);
  });
});
