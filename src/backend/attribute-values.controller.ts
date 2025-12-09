import { Controller, Post, Body } from "@nestjs/common";
import { AttributeValuesService } from "./attribute-values.service";

@Controller("attribute-values")
export class AttributeValuesController {
  constructor(private readonly service: AttributeValuesService) {}

  @Post()
  register(
    @Body() body: { machineId: number; attributeName: string; value: number }
  ) {
    return this.service.registerAttribute(
      body.machineId,
      body.attributeName,
      body.value
    );
  }
}
