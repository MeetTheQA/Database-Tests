

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Vehicles {
  @PrimaryGeneratedColumn()
  vehicle_id: number; 

  @Column()
  vehicle_type: string;

  @Column()
  vehicle_brand: string;

  @Column("numeric")
  vehicle_load: number;

  @Column("numeric")
  vehicle_capacity: number;

  @Column("int")
  years: number;

  @Column("int")
  number_of_repairs: number;
}
