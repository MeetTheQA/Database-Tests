
import { DataSource } from "typeorm";
import { DataConnector } from "../configure";
import { Employees } from "./Employees";
import express from "express";

export default class EmployeeApi {
  #dataConnector: DataConnector<Employees, Options>;

  constructor(dataConnector: DataConnector<Employees, Options>) {
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
    firstName: string,
    lastName: string,
    seniority: number,
    isMechanic: boolean
  ) {
    const employee = new Employees();

    employee.employee_first_name = firstName;
    employee.employee_last_name = lastName;
    employee.employee_seniority = seniority;
    employee.employee_is_mechanic = isMechanic;

    this.#dataConnector.save(employee);
  }

  async update(
    id: string,
    firstName: string,
    lastName: string,
    seniority: number,
    isMechanic: boolean
  ) {
    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    const updatedData: Partial<Employees> = {
      employee_id: parseInt(id),
      employee_first_name: firstName,
      employee_last_name: lastName,
      employee_seniority: seniority,
      employee_is_mechanic: isMechanic,
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

export class EmployeeApiDataConnector implements DataConnector<Employees, Options> {
  #dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  async findBy(options: Options): Promise<Employees[]> {
    return await this.#dataSource.manager.find(Employees, {
      where: {
        employee_id: options.id,
      },
    });
  }

  async save(entity: Employees) {
    try {
      const createdEmployee = await this.#dataSource.manager.save(entity);
      console.log(`employee has been created with id: ${createdEmployee.employee_id}`);
    } catch (err) {
      throw new Error('there was an issue with creating the employee');
    }
  }

  async update(id: string, updatedData: Partial<Employees>): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const existingEmployee = await this.#dataSource.manager.findOne(Employees, { where: { employee_id: numericId } });

      if (!existingEmployee) {
        console.log(`employee with id ${numericId} not found`);
        return;
      }

      this.#dataSource.manager.merge(Employees, existingEmployee, updatedData);
      const updatedEmployee = await this.#dataSource.manager.save(existingEmployee);
      console.log(`employee has been updated with id: ${updatedEmployee.employee_id}`);
    } catch (err) {
      throw new Error('there was an issue with updating the employee');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const employeeToDelete = await this.#dataSource.manager.findOne(Employees, { where: { employee_id: numericId } });

      if (!employeeToDelete) {
        console.log(`employee with id ${numericId} not found`);
        return;
      }

      await this.#dataSource.manager.remove(employeeToDelete);
      console.log(`employee has been deleted with id: ${numericId}`);
    } catch (err) {
      throw new Error('there was an issue with deleting the employee');
    }
  }
}
