import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Connector } from '../../connectors/entities/connector.entity';
import { Machine } from 'src/machines/entities/machine.entity';

@Entity()
export class Gateway {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @OneToMany(() => Connector, (connector) => connector.gateway)
  connectors: Connector[];

  @OneToMany(() => Machine, (machine) => machine.gateway)
  machines: Machine[];
}
