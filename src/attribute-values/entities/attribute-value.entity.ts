import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Machine } from '../../machines/entities/machine.entity';

@Entity()
@Index(['machine', 'attributeName', 'timestamp'])
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributeName: string;

  @Column('float')
  value: number;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Machine, (machine) => machine.attributeValues, {
    onDelete: 'CASCADE',
  })
  machine: Machine;
}
