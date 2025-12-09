import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttributeValue } from "./entities/attribute-value.entity";
import { Machine } from "../machines/entities/machine.entity";

@Injectable()
export class AttributeValuesService {
  constructor(
    @InjectRepository(AttributeValue)
    private avRepo: Repository<AttributeValue>,

    @InjectRepository(Machine)
    private machineRepo: Repository<Machine>
  ) {}

  async registerAttribute(
    machineId: number,
    attributeName: string,
    value: number
  ) {
    const machine = await this.machineRepo.findOne({
      where: { id: machineId },
    });
    if (!machine) throw new Error("Machine not found");

    const attribute = this.avRepo.create({
      machine,
      attributeName,
      value,
      timestamp: new Date(),
    });

    return this.avRepo.save(attribute);
  }
}
