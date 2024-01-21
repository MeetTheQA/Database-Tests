
import { DataSource } from "typeorm";
import { DataConnector } from "../configure";
import { EmployeeVehicleCertifications } from "./EmployeeVehicleCertifications";
import express from "express";

export default class EmployeeVehicleCertificationsApi {
  #dataConnector: DataConnector<EmployeeVehicleCertifications, Options>;

  constructor(dataConnector: DataConnector<EmployeeVehicleCertifications, Options>) {
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
    employeeId: number,
    vehicleId1: number,
    vehicleId2: number,
    vehicleId3: number
  ) {
    const certification = new EmployeeVehicleCertifications();

    certification.employee_id = employeeId;
    certification.vehicle_id1 = vehicleId1;
    certification.vehicle_id2 = vehicleId2;
    certification.vehicle_id3 = vehicleId3;

    this.#dataConnector.save(certification);
  }

  async update(
    id: string,
    employeeId: number,
    vehicleId1: number,
    vehicleId2: number,
    vehicleId3: number
  ) {
    if (!id) {
      throw new Error('id cannot be an empty string');
    }

    const updatedData: Partial<EmployeeVehicleCertifications> = {
      certification_id: parseInt(id),
      employee_id: employeeId,
      vehicle_id1: vehicleId1,
     vehicle_id2: vehicleId2,
      vehicle_id3: vehicleId3,
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

export class EmployeeVehicleCertificationsApiDataConnector implements DataConnector<EmployeeVehicleCertifications, Options> {
  #dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  async findBy(options: Options): Promise<EmployeeVehicleCertifications[]> {
    return await this.#dataSource.manager.find(EmployeeVehicleCertifications, {
      where: {
        certification_id: options.id,
      },
    });
  }

  async save(entity: EmployeeVehicleCertifications) {
    try {
      const createdCertification = await this.#dataSource.manager.save(entity);
      console.log(`certification has been created with id: ${createdCertification.certification_id}`);
    } catch (err) {
      throw new Error('there was an issue with creating the certification');
    }
  }

  async update(id: string, updatedData: Partial<EmployeeVehicleCertifications>): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const existingCertification = await this.#dataSource.manager.findOne(EmployeeVehicleCertifications, { where: { certification_id: numericId } });

      if (!existingCertification) {
        console.log(`certification with id ${numericId} not found`);
        return;
      }

      this.#dataSource.manager.merge(EmployeeVehicleCertifications, existingCertification, updatedData);
      const updatedCertification = await this.#dataSource.manager.save(existingCertification);
      console.log(`certification has been updated with id: ${updatedCertification.certification_id}`);
    } catch (err) {
      throw new Error('there was an issue with updating the certification');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const numericId: number = parseInt(id, 10);

      const certificationToDelete = await this.#dataSource.manager.findOne(EmployeeVehicleCertifications, { where: { certification_id: numericId } });

      if (!certificationToDelete) {
        console.log(`certification with id ${numericId} not found`);
        return;
      }

      await this.#dataSource.manager.remove(certificationToDelete);
      console.log(`certification has been deleted with id: ${numericId}`);
    } catch (err) {
      throw new Error('there was an issue with deleting the certification');
    }
  }
}
