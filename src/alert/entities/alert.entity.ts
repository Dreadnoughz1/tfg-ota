import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Machine } from '../../machines/entities/machine.entity';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributeName: string;

  @Column('float')
  value: number;

  @Column('float')
  threshold: number;

  @Column()
  operator: string;

  @Column()
  severity: string;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Machine, { onDelete: 'CASCADE' })
  machine: Machine;
}
