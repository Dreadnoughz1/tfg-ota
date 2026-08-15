import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Gateway } from '../../gateways/entities/gateway.entity';
import { Machine } from '../../machines/entities/machine.entity';

@Entity()
export class Connector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  portName: string;

  @ManyToOne(() => Gateway, (gateway) => gateway.connectors, {
    onDelete: 'CASCADE',
  })
  gateway: Gateway;

  @OneToMany(() => Machine, (machine) => machine.connector)
  machines: Machine[];
}
