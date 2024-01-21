
import { DataSource } from "typeorm";
import { DataConnector } from "../configure";
import { Routes } from "./Routes";
import express from "express";

export default class RoutesApi {
  #dataConnector: DataConnector<Routes, Options>;

  constructor(dataConnector: DataConnector<Routes, Options>) {
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
    origin: string,
    destination: string,
    distance: number,
    estimatedTime: number
  ) {
    const route = new Routes();

    route.route_origin = origin;
    route.route_destination = destination;
    route.route_distance = distance;
    route.route_estimated_time = estimatedTime;

    this.#dataConnector.save(route);
  }

  async update(
    id: string,
    origin: string,
    destination: string,
    distance: number,
    estimatedTime: number
  ) {
    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    const updatedData: Partial<Routes> = {
      route_id: parseInt(id),
      route_origin: origin,
      route_destination: destination,
      route_distance: distance,
      route_estimated_time: estimatedTime,
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

export class RoutesApiDataConnector implements DataConnector<Routes, Options> {
  #dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  async findBy(options: Options): Promise<Routes[]> {
    return await this.#dataSource.manager.find(Routes, {
      where: {
        route_id: options.id,
      },
    });
  }

  async save(entity: Routes) {
    try {
      const createdRoute = await this.#dataSource.manager.save(entity);
      console.log(`route has been created with id: ${createdRoute.route_id}`);
    } catch (err) {
      throw new Error('there was an issue with creating the route');
    }
  }

  async update(id: string, updatedData: Partial<Routes>): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const existingRoute = await this.#dataSource.manager.findOne(Routes, { where: { route_id: numericId } });

      if (!existingRoute) {
        console.log(`route with id ${numericId} not found`);
        return;
      }

      this.#dataSource.manager.merge(Routes, existingRoute, updatedData);
      const updatedRoute = await this.#dataSource.manager.save(existingRoute);
      console.log(`route has been updated with id: ${updatedRoute.route_id}`);
    } catch (err) {
      throw new Error('there was an issue with updating the route');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const routeToDelete = await this.#dataSource.manager.findOne(Routes, { where: { route_id: numericId } });

      if (!routeToDelete) {
        console.log(`route with id ${numericId} not found`);
        return;
      }

      await this.#dataSource.manager.remove(routeToDelete);
      console.log(`route has been deleted with id: ${numericId}`);
    } catch (err) {
      throw new Error('there was an issue with deleting the route');
    }
  }
}
