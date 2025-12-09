import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Connector } from "./index";

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
}
