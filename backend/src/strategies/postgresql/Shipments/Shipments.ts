
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Customers } from "../Customers/Customers";

@Entity()
export class Shipments {
  @PrimaryGeneratedColumn()
  shipment_id: number;

  @ManyToOne(() => Customers)
  customer_id: number;

  @Column()
  shipment_name: string;

  @Column("numeric")
  shipment_weight: number;

  @Column("numeric")
  shipment_value: number;
}

