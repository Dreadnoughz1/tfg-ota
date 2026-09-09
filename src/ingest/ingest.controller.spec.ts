import { Test, TestingModule } from '@nestjs/testing';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { IngestHierarchyDto } from './dto';

describe('IngestController', () => {
  let controller: IngestController;
  let ingestService: { ingest: jest.Mock };

  beforeEach(async () => {
    ingestService = {
      ingest: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [
        {
          provide: IngestService,
          useValue: ingestService,
        },
      ],
    }).compile();

    controller = module.get<IngestController>(IngestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('ingestAttributes debe delegar la llamada en ingestService.ingest', async () => {
    const dto: IngestHierarchyDto = {
      gatewayId: 1,
      connectorId: 2,
      machineId: 3,
      attributes: [{ attributeName: 'temp', value: 85, timestamp: '2026-01-01' }],
    };
    ingestService.ingest.mockResolvedValue({ status: 'ok', inserted: 1 });

    const result = await controller.ingestAttributes(dto);
    expect(ingestService.ingest).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ status: 'ok', inserted: 1 });
  });
});
