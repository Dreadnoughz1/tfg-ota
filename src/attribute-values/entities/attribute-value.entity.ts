import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Machine } from '../../machines/entities/machine.entity';

@Entity()
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributeName: string;

  @Column('float')
  value: number;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Machine, (machine) => machine.attributeValues)
  machine: Machine;
}
