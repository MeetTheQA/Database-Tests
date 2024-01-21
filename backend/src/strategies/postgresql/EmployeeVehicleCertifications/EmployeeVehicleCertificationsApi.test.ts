
import { DataConnector, postgresDataSource } from "../configure";
import { EmployeeVehicleCertifications } from "./EmployeeVehicleCertifications";
import EmployeeVehicleCertificationsApi, { Options, EmployeeVehicleCertificationsApiDataConnector } from "./EmployeeVehicleCertificationsApi";

describe("employee vehicle certifications api test", () => {
  test("get", async () => {
    const certApi = new EmployeeVehicleCertificationsApi(new MockEmployeeCertApiDataConnector());

    const result = await certApi.get("1234");

    expect(result).toHaveLength(0);
  });

  test("delete method throws an error when certification is not found", async () => {
    const certApi = new EmployeeVehicleCertificationsApi(new MockEmployeeCertApiDataConnector());
    await expect(certApi.delete("1")).rejects.toThrow("Certification with the given ID not found"); 
  });

  test("delete", async () => {
    const certApi = new EmployeeVehicleCertificationsApi(new MockEmployeeCertApiDataConnector());
    await certApi.delete("1"); 
  });

  test("should save a new certification with the provided data", async () => {
    const certApi = new EmployeeVehicleCertificationsApi(new MockEmployeeCertApiDataConnector());
    await certApi.post(1, 2, 3, 4);
  });
});

class MockEmployeeCertApiDataConnector implements DataConnector<EmployeeVehicleCertifications, Options> {
  private certifications: EmployeeVehicleCertifications[] = [];

  async findBy(options: Options): Promise<EmployeeVehicleCertifications[]> {
    return this.certifications.filter((certification) => certification.certification_id === options.id);
  }

  save(entity: EmployeeVehicleCertifications): void {
    this.certifications.push(entity);
  }

  async update(id: string, updatedData: Partial<EmployeeVehicleCertifications>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const existingCertIndex = this.certifications.findIndex((certification) => certification.certification_id === parseInt(id, 10));

      if (existingCertIndex !== -1) {
        this.certifications[existingCertIndex] = { ...this.certifications[existingCertIndex], ...updatedData };
        resolve();
      } else {
        reject(new Error(`Certification with ID ${id} not found for update`));
      }
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const indexToDelete = this.certifications.findIndex((certification) => certification.certification_id === parseInt(id, 10));

      if (indexToDelete !== -1) {
        this.certifications.splice(indexToDelete, 1);
        resolve();
      } else {
        reject(new Error(`Certification with ID ${id} not found for deletion`));
      }
    });
  }
}
