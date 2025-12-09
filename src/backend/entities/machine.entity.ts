import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Connector } from "../../connectors/entities/connector.entity";
import { AttributeValue } from "../../attribute-values/entities/attribute-value.entity";

@Entity()
export class Machine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serial: string;

  @Column()
  model: string;

  @ManyToOne(() => Connector, (connector) => connector.machines)
  connector: Connector;

  @OneToMany(() => AttributeValue, (av) => av.machine)
  attributeValues: AttributeValue[];
}
