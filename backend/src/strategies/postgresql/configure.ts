import { DataSource } from "typeorm";
import { Customers } from "./Customers/Customers";
import { Employees } from "./Employee/Employees";
import { EmployeeVehicleCertifications } from "./EmployeeVehicleCertifications/EmployeeVehicleCertifications";
import { Routes } from "./Routes/Routes";
import { Shipments } from "./Shipments/Shipments";
import { Trips } from "./Trips/Trips";
import { Vehicles } from "./Vehicle/Vehicles";
import { VehicleRepairs } from "./VehicleRepairs/VehicleRepairs";

export const postgresDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "pg_password",
    database: "pg-persistence-service-development",
    synchronize: true,
    logging: true,
    entities: [Customers, Employees, EmployeeVehicleCertifications, Routes, Shipments, Trips, Vehicles, VehicleRepairs],
});

export interface DataConnector<T, R> {
    save: (entity: T) => void; // create
    findBy: (option: R) => Promise<T[]>; // read
    update: (id: string, updatedData: Partial<T>) => Promise<void>;
    delete (id: string): Promise<void>;
  
  }
