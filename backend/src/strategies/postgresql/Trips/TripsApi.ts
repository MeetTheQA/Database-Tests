// TripsApi.ts

import { DataSource } from "typeorm";
import { DataConnector } from "../configure";
import { Trips } from "./Trips";
import express from "express";

export default class TripsApi {
  #dataConnector: DataConnector<Trips, Options>;

  constructor(dataConnector: DataConnector<Trips, Options>) {
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
    routeId: number,
    vehicleId: number,
    driver1Id: number,
    driver2Id: number,
    shipmentId: number
  ) {
    const trip = new Trips();

    trip.route_id = routeId;
    trip.vehicle_id = vehicleId;
    trip.driver1_id = driver1Id;
    trip.driver2_id = driver2Id;
    trip.shipment_id = shipmentId;

    this.#dataConnector.save(trip);
  }

  async update(
    id: string,
    routeId: number,
    vehicleId: number,
    driver1Id: number,
    driver2Id: number,
    shipmentId: number
  ) {
    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    const updatedData: Partial<Trips> = {
      trip_id: parseInt(id),
      route_id: routeId,
      vehicle_id: vehicleId,
      driver1_id: driver1Id,
      driver2_id: driver2Id,
      shipment_id: shipmentId,
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

export class TripsApiDataConnector implements DataConnector<Trips, Options> {
  #dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  async findBy(options: Options): Promise<Trips[]> {
    return await this.#dataSource.manager.find(Trips, {
      where: {
        trip_id: options.id,
      },
    });
  }

  async save(entity: Trips) {
    try {
      const createdTrip = await this.#dataSource.manager.save(entity);
      console.log(`trip has been created with id: ${createdTrip.trip_id}`);
    } catch (err) {
      throw new Error('there was an issue with creating the trip');
    }
  }

  async update(id: string, updatedData: Partial<Trips>): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const existingTrip = await this.#dataSource.manager.findOne(Trips, { where: { trip_id: numericId } });

      if (!existingTrip) {
        console.log(`trip with id ${numericId} not found`);
        return;
      }

      this.#dataSource.manager.merge(Trips, existingTrip, updatedData);
      const updatedTrip = await this.#dataSource.manager.save(existingTrip);
      console.log(`trip has been updated with id: ${updatedTrip.trip_id}`);
    } catch (err) {
      throw new Error('there was an issue with updating the trip');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const tripToDelete = await this.#dataSource.manager.findOne(Trips, { where: { trip_id: numericId } });

      if (!tripToDelete) {
        console.log(`trip with id ${numericId} not found`);
        return;
      }

      await this.#dataSource.manager.remove(tripToDelete);
      console.log(`trip has been deleted with id: ${numericId}`);
    } catch (err) {
      throw new Error('there was an issue with deleting the trip');
    }
  }
}
