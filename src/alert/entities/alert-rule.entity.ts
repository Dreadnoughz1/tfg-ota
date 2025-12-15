import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Machine } from '../../machines/entities/machine.entity';

export type AlertOperator = '>' | '<' | '>=' | '<=' | '=';

@Entity()
export class AlertRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributeName: string;

  @Column()
  operator: AlertOperator;

  @Column('float')
  threshold: number;

  @Column({ default: 'warning' })
  severity: 'warning' | 'critical';

  @ManyToOne(() => Machine, { onDelete: 'CASCADE' })
  machine: Machine;
}
