import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
@Index(['machineId', 'attributeName', 'timestamp'])
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributeName: string;

  @Column('float')
  value: number;

  @Column()
  timestamp: Date;

  @Column()
  machineId: number;

  @Column()
  gatewayId: number;

  @Column()
  connectorId: number;

  @Column()
  lifeBit: boolean;

  @Column()
  connexionStatus: string;
}
