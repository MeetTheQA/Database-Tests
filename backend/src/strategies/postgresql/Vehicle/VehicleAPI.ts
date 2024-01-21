
import { DataSource } from "typeorm";
import { DataConnector } from "../configure";
import { Vehicles } from "./Vehicles";
import express from "express";

export default class VehicleApi {
  #dataConnector: DataConnector<Vehicles, Options>;

  constructor(dataConnector: DataConnector<Vehicles, Options>) {
    this.#dataConnector = dataConnector;
  }

  async get(id: string) {
    console.log(id);

    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    return await this.#dataConnector.findBy({ id: parseInt(id) });
  }

  async post(
    vehicleType: string,
    vehicleBrand: string,
    vehicleLoad: number,
    vehicleCapacity: number,
    years: number,
    numberOfRepairs: number,
  ) {
    const vehicle = new Vehicles();

    vehicle.vehicle_type = vehicleType;
    vehicle.vehicle_brand = vehicleBrand;
    vehicle.vehicle_load = vehicleLoad;
    vehicle.vehicle_capacity = vehicleCapacity;
    vehicle.years = years;
    vehicle.number_of_repairs = numberOfRepairs;

    this.#dataConnector.save(vehicle);
  }

  async update(
    id: string,
    vehicleType: string,
    vehicleBrand: string,
    vehicleLoad: number,
    vehicleCapacity: number,
    years: number,
    numberOfRepairs: number,
  ) {
    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    const updatedData: Partial<Vehicles> = {
      vehicle_id: parseInt(id),
      vehicle_type: vehicleType,
      vehicle_brand: vehicleBrand,
      vehicle_load: vehicleLoad,
      vehicle_capacity: vehicleCapacity,
      years: years,
      number_of_repairs: numberOfRepairs,
    };

    await this.#dataConnector.update(id, updatedData);
  }

  async delete(id: string) {
    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    await this.#dataConnector.delete(id);
  }
}

export interface Options {
  id: number;
}

export class VehicleApiDataConnector implements DataConnector<Vehicles, Options> {
  #dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

//   async findBy(options: Options): Promise<Vehicles[]> {
//     return await this.#dataSource.manager.find(Vehicles, {
//       vehicle_id: options.id,
//       // Object literal may only specify known properties, and 'vehicle_id' does not exist in type 'FindManyOptions<Vehicles>'.ts(2353)
//     });
//   }

  async findBy(options: Options): Promise<Vehicles[]> {
    return await this.#dataSource.manager.find(Vehicles, {
      where: {
        vehicle_id: options.id,
      },
    });
  }
  

  async save(entity: Vehicles) {
    try {
      const createdVehicle = await this.#dataSource.manager.save(entity);
      console.log(`vehicle has been created with id: ${createdVehicle.vehicle_id}`);
    } catch (err) {
      throw new Error('there was an issue with creating the vehicle');
    }
  }

  async update(id: string, updatedData: Partial<Vehicles>): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const existingVehicle = await this.#dataSource.manager.findOne(Vehicles, { where: { vehicle_id: numericId } });

      if (!existingVehicle) {
        console.log(`vehicle with id ${numericId} not found`);
        return;
      }

      this.#dataSource.manager.merge(Vehicles, existingVehicle, updatedData);
      const updatedVehicle = await this.#dataSource.manager.save(existingVehicle);
      console.log(`vehicle has been updated with id: ${updatedVehicle.vehicle_id}`);
    } catch (err) {
      throw new Error('there was an issue with updating the vehicle');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const vehicleToDelete = await this.#dataSource.manager.findOne(Vehicles, { where: { vehicle_id: numericId } });

      if (!vehicleToDelete) {
        console.log(`vehicle with id ${numericId} not found`);
        return;
      }

      await this.#dataSource.manager.remove(vehicleToDelete);
      console.log(`vehicle has been deleted with id: ${numericId}`);
    } catch (err) {
      throw new Error('there was an issue with deleting the vehicle');
    }
  }
}
