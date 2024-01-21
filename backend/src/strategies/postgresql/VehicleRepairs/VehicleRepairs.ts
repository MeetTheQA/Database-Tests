
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Vehicles } from "../Vehicle/Vehicles";
import { Employees } from "../Employee/Employees";

@Entity()
export class VehicleRepairs {
  @PrimaryGeneratedColumn()
  repair_id: number;

  @ManyToOne(() => Vehicles)
  vehicle_id: number; 

  @ManyToOne(() => Employees)
  mechanic_id: number; 


  @Column("int")
  repair_estimated_time: number;

  @Column("int")
  repair_actual_time: number;
}
