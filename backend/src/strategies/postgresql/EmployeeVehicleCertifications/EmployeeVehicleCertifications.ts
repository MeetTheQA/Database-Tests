
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Employees } from "../Employee/Employees";
import { Vehicles } from "../Vehicle/Vehicles";

@Entity()
export class EmployeeVehicleCertifications {
  @PrimaryGeneratedColumn()
  certification_id: number;

  @ManyToOne(() => Employees)
  employee_id: number; 

  @ManyToOne(() => Vehicles)
  vehicle_id1: number;

  @ManyToOne(() => Vehicles)
  vehicle_id2: number; 

  @ManyToOne(() => Vehicles)
  vehicle_id3: number; 

}
