import { Controller } from '@nestjs/common';
import { GatewaysService } from './gateways.service';

@Controller('gateways')
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) {}
}
