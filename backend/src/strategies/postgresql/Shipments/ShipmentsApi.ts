
import { DataSource } from "typeorm";
import { DataConnector } from "../configure";
import { Shipments } from "./Shipments";
import express from "express";

export default class ShipmentsApi {
  #dataConnector: DataConnector<Shipments, Options>;

  constructor(dataConnector: DataConnector<Shipments, Options>) {
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
    customerId: number,
    shipmentName: string,
    shipmentWeight: number,
    shipmentValue: number
  ) {
    const shipment = new Shipments();

    shipment.customer_id = customerId;
    shipment.shipment_name = shipmentName;
    shipment.shipment_weight = shipmentWeight;
    shipment.shipment_value = shipmentValue;

    this.#dataConnector.save(shipment);
  }

  async update(
    id: string,
    customerId: number,
    shipmentName: string,
    shipmentWeight: number,
    shipmentValue: number
  ) {
    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    const updatedData: Partial<Shipments> = {
      shipment_id: parseInt(id),
      customer_id: customerId,
      shipment_name: shipmentName,
      shipment_weight: shipmentWeight,
      shipment_value: shipmentValue,
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

export class ShipmentsApiDataConnector implements DataConnector<Shipments, Options> {
  #dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  async findBy(options: Options): Promise<Shipments[]> {
    return await this.#dataSource.manager.find(Shipments, {
      where: {
        shipment_id: options.id,
      },
    });
  }

  async save(entity: Shipments) {
    try {
      const createdShipment = await this.#dataSource.manager.save(entity);
      console.log(`shipment has been created with id: ${createdShipment.shipment_id}`);
    } catch (err) {
      throw new Error('there was an issue with creating the shipment');
    }
  }

  async update(id: string, updatedData: Partial<Shipments>): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const existingShipment = await this.#dataSource.manager.findOne(Shipments, { where: { shipment_id: numericId } });

      if (!existingShipment) {
        console.log(`shipment with id ${numericId} not found`);
        return;
      }

      this.#dataSource.manager.merge(Shipments, existingShipment, updatedData);
      const updatedShipment = await this.#dataSource.manager.save(existingShipment);
      console.log(`shipment has been updated with id: ${updatedShipment.shipment_id}`);
    } catch (err) {
      throw new Error('there was an issue with updating the shipment');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const shipmentToDelete = await this.#dataSource.manager.findOne(Shipments, { where: { shipment_id: numericId } });

      if (!shipmentToDelete) {
        console.log(`shipment with id ${numericId} not found`);
        return;
      }

      await this.#dataSource.manager.remove(shipmentToDelete);
      console.log(`shipment has been deleted with id: ${numericId}`);
    } catch (err) {
      throw new Error('there was an issue with deleting the shipment');
    }
  }
}
