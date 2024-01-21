
import { DataSource } from "typeorm";
import { DataConnector } from "../configure";
import { Customers } from "./Customers";
import express from "express";

export default class CustomersApi {
  #dataConnector: DataConnector<Customers, Options>;

  constructor(dataConnector: DataConnector<Customers, Options>) {
    this.#dataConnector = dataConnector;
  }

  async get(customer_id: string) {
    console.log(customer_id);

    if (!customer_id) {
      throw new Error('id cannot be an empty string');
    }

    // return await this.#dataConnector.findBy({ id: parseInt(id) });

    const result = await this.#dataConnector.findBy({ id: parseInt(customer_id) });
    console.log('Result:', result);
  
    return result;

  }

  async post(
    name: string,
    address: string,
    phone1: string,
    phone2: string
  ) {
    const customer = new Customers();

    customer.customer_name = name;
    customer.customer_address = address;
    customer.customer_phone1 = phone1;
    customer.customer_phone2 = phone2;

    this.#dataConnector.save(customer);
  }

  async update(
    id: string,
    name: string,
    address: string,
    phone1: string,
    phone2: string
  ) {
    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    const updatedData: Partial<Customers> = {
      customer_id: parseInt(id),
      customer_name: name,
      customer_address: address,
      customer_phone1: phone1,
      customer_phone2: phone2,
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

export class CustomersApiDataConnector implements DataConnector<Customers, Options> {
  #dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  async findBy(options: Options): Promise<Customers[]> {
    return await this.#dataSource.manager.find(Customers, {
      where: {
        customer_id: options.id,
      },
    });
  }

  async save(entity: Customers) {
    try {
      const createdCustomer = await this.#dataSource.manager.save(entity);
      console.log(`customer has been created with id: ${createdCustomer.customer_id}`);
    } catch (err) {
      throw new Error('there was an issue with creating the customer');
    }
  }

  async update(id: string, updatedData: Partial<Customers>): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const existingCustomer = await this.#dataSource.manager.findOne(Customers, { where: { customer_id: numericId } });

      if (!existingCustomer) {
        console.log(`customer with id ${numericId} not found`);
        return;
      }

      this.#dataSource.manager.merge(Customers, existingCustomer, updatedData);
      const updatedCustomer = await this.#dataSource.manager.save(existingCustomer);
      console.log(`customer has been updated with id: ${updatedCustomer.customer_id}`);
    } catch (err) {
      throw new Error('there was an issue with updating the customer');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const customerToDelete = await this.#dataSource.manager.findOne(Customers, { where: { customer_id: numericId } });

      if (!customerToDelete) {
        console.log(`customer with id ${numericId} not found`);
        return;
      }

      await this.#dataSource.manager.remove(customerToDelete);
      console.log(`customer has been deleted with id: ${numericId}`);
    } catch (err) {
      throw new Error('there was an issue with deleting the customer');
    }
  }
}
