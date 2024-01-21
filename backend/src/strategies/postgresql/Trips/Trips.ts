
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Routes } from "../Routes/Routes";
import { Vehicles } from "../Vehicle/Vehicles";
import { Employees } from "../Employee/Employees";
import { Shipments } from "../Shipments/Shipments";

@Entity()
export class Trips {
  @PrimaryGeneratedColumn()
  trip_id: number;

  @ManyToOne(() => Routes)
  route_id: number;

  @ManyToOne(() => Vehicles)
  vehicle_id: number;

  @ManyToOne(() => Employees)
  driver1_id: number;

  @ManyToOne(() => Employees)
  driver2_id: number;

  @ManyToOne(() => Shipments)
  shipment_id: number;
}
