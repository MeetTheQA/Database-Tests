
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Employees {
  @PrimaryGeneratedColumn()
  employee_id: number; 

  @Column()
  employee_first_name: string;

  @Column()
  employee_last_name: string;

  @Column("int")
  employee_seniority: number;

  @Column()
  employee_is_mechanic: boolean;
}
