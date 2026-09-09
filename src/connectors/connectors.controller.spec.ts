import { Test, TestingModule } from '@nestjs/testing';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';

describe('ConnectorsController', () => {
  let controller: ConnectorsController;
  let connectorsService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    connectorsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectorsController],
      providers: [
        {
          provide: ConnectorsService,
          useValue: connectorsService,
        },
      ],
    }).compile();

    controller = module.get<ConnectorsController>(ConnectorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create debe llamar a connectorsService.create', async () => {
    const dto: any = { name: 'C1', portName: 'COM1', gatewayId: 1, machinesId: [] };
    connectorsService.create.mockResolvedValue({ id: 1, ...dto });
    const res = await controller.create(dto);
    expect(connectorsService.create).toHaveBeenCalledWith(dto);
    expect(res).toHaveProperty('id', 1);
  });

  it('findOne debe llamar a connectorsService.findOne', async () => {
    connectorsService.findOne.mockResolvedValue({ id: 1 });
    const res = await controller.findOne('1');
    expect(connectorsService.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual({ id: 1 });
  });

  it('remove debe llamar a connectorsService.remove', async () => {
    connectorsService.remove.mockResolvedValue(undefined);
    await controller.remove('1');
    expect(connectorsService.remove).toHaveBeenCalledWith(1);
  });
});
