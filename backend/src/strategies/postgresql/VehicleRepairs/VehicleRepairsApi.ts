
import { DataSource } from "typeorm";
import { DataConnector } from "../configure";
import { VehicleRepairs } from "./VehicleRepairs";
import express from "express";

export default class VehicleRepairsApi {
  #dataConnector: DataConnector<VehicleRepairs, Options>;

  constructor(dataConnector: DataConnector<VehicleRepairs, Options>) {
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
    vehicleId: number,
    mechanicId: number,
    repairEstimatedTime: number,
    repairActualTime: number
  ) {
    const repair = new VehicleRepairs();

    repair.vehicle_id = vehicleId;
    repair.mechanic_id = mechanicId;
    repair.repair_estimated_time = repairEstimatedTime;
    repair.repair_actual_time = repairActualTime;

    this.#dataConnector.save(repair);
  }

  async update(
    id: string,
    vehicleId: number,
    mechanicId: number,
    repairEstimatedTime: number,
    repairActualTime: number
  ) {
    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    const updatedData: Partial<VehicleRepairs> = {
      repair_id: parseInt(id),
      vehicle_id: vehicleId,
 mechanic_id: mechanicId,
    
      repair_estimated_time: repairEstimatedTime,
      repair_actual_time: repairActualTime,
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

export class VehicleRepairsApiDataConnector implements DataConnector<VehicleRepairs, Options> {
  #dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  async findBy(options: Options): Promise<VehicleRepairs[]> {
    return await this.#dataSource.manager.find(VehicleRepairs, {
      where: {
        repair_id: options.id,
      },
    });
  }

  async save(entity: VehicleRepairs) {
    try {
      const createdRepair = await this.#dataSource.manager.save(entity);
      console.log(`repair has been created with id: ${createdRepair.repair_id}`);
    } catch (err) {
      throw new Error('there was an issue with creating the repair');
    }
  }

  async update(id: string, updatedData: Partial<VehicleRepairs>): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const existingRepair = await this.#dataSource.manager.findOne(VehicleRepairs, { where: { repair_id: numericId } });

      if (!existingRepair) {
        console.log(`repair with id ${numericId} not found`);
        return;
      }

      this.#dataSource.manager.merge(VehicleRepairs, existingRepair, updatedData);
      const updatedRepair = await this.#dataSource.manager.save(existingRepair);
      console.log(`repair has been updated with id: ${updatedRepair.repair_id}`);
    } catch (err) {
      throw new Error('there was an issue with updating the repair');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const repairToDelete = await this.#dataSource.manager.findOne(VehicleRepairs, { where: { repair_id: numericId } });

      if (!repairToDelete) {
        console.log(`repair with id ${numericId} not found`);
        return;
      }

      await this.#dataSource.manager.remove(repairToDelete);
      console.log(`repair has been deleted with id: ${numericId}`);
    } catch (err) {
      throw new Error('there was an issue with deleting the repair');
    }
  }
}
