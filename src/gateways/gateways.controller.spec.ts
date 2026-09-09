import { Test, TestingModule } from '@nestjs/testing';
import { GatewaysController } from './gateways.controller';
import { GatewaysService } from './gateways.service';

describe('GatewaysController', () => {
  let controller: GatewaysController;
  let gatewaysService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    gatewaysService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewaysController],
      providers: [
        {
          provide: GatewaysService,
          useValue: gatewaysService,
        },
      ],
    }).compile();

    controller = module.get<GatewaysController>(GatewaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create debe llamar a gatewaysService.create', async () => {
    const dto: any = { name: 'G1', location: 'L1', connectorsId: [], machinesId: [] };
    gatewaysService.create.mockResolvedValue({ id: 1, ...dto });
    const res = await controller.create(dto);
    expect(gatewaysService.create).toHaveBeenCalledWith(dto);
    expect(res).toHaveProperty('id', 1);
  });

  it('findOne debe llamar a gatewaysService.findOne', async () => {
    gatewaysService.findOne.mockResolvedValue({ id: 1 });
    const res = await controller.findOne('1');
    expect(gatewaysService.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual({ id: 1 });
  });

  it('remove debe llamar a gatewaysService.remove', async () => {
    gatewaysService.remove.mockResolvedValue(undefined);
    await controller.remove('1');
    expect(gatewaysService.remove).toHaveBeenCalledWith(1);
  });
});
