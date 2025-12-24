import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Connector } from '../../connectors/entities/connector.entity';
import { Gateway } from 'src/gateways/entities/gateway.entity';

@Entity()
export class Machine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  serial: string;

  @Column()
  model: string;

  @ManyToOne(() => Connector, (connector) => connector.machines, {
    onDelete: 'CASCADE',
  })
  connector: Connector;

  @ManyToOne(() => Gateway, (gateway) => gateway.machines)
  gateway: Gateway;
}
