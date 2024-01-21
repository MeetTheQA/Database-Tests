
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Customers {
  @PrimaryGeneratedColumn()
  customer_id: number; 

  @Column()
  customer_name: string;

  @Column()
  customer_address: string;

  @Column({ length: 20 })
  customer_phone1: string;

  @Column({ length: 20 })
  customer_phone2: string;
}
