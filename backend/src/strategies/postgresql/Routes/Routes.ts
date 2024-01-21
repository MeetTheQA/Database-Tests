// Routes.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Routes {
  @PrimaryGeneratedColumn()
  route_id: number;

  @Column()
  route_origin: string;

  @Column()
  route_destination: string;

  @Column("numeric")
  route_distance: number;

  @Column("int")
  route_estimated_time: number;
}
