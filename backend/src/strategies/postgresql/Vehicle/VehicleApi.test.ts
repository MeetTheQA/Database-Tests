
import { DataConnector, postgresDataSource } from "../configure";
import { Vehicles } from "./Vehicles";
import VehicleApi, { Options, VehicleApiDataConnector } from "./VehicleAPI";

describe("vehicle api test", () => {
  test("get", async () => {
    const vehicleApi = new VehicleApi(new MockVehicleApiDataConnector());

    const result = await vehicleApi.get("1");

    expect(result).toHaveLength(0);
  });



  test("delete method throws an error when vehicle is not found", async () => {
    const vehicleApi = new VehicleApi(new MockVehicleApiDataConnector());
    await expect(vehicleApi.delete("1")).rejects.toThrow("Vehicle with the given ID not found"); 
  });

  test("delete", async () => {
    const vehicleApi = new VehicleApi(new MockVehicleApiDataConnector());
    await vehicleApi.delete("1"); 
  });

  test("should save a new vehicle with the provided data", async () => {
    const vehicleApi = new VehicleApi(new MockVehicleApiDataConnector());
    await vehicleApi.post("Car", "Toyota", 1000, 5, 2022, 0);
  });
});

class MockVehicleApiDataConnector implements DataConnector<Vehicles, Options> {
  private vehicles: Vehicles[] = [];

  async findBy(options: Options): Promise<Vehicles[]> {
    return this.vehicles.filter((vehicle) => vehicle.vehicle_id === options.id);
  }

  save(entity: Vehicles): void {
    this.vehicles.push(entity);
  }

  async update(id: string, updatedData: Partial<Vehicles>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const existingVehicleIndex = this.vehicles.findIndex((vehicle) => vehicle.vehicle_id === parseInt(id, 10));

      if (existingVehicleIndex !== -1) {
        this.vehicles[existingVehicleIndex] = { ...this.vehicles[existingVehicleIndex], ...updatedData };
        resolve();
      } else {
        reject(new Error(`Vehicle with ID ${id} not found for update`));
      }
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const indexToDelete = this.vehicles.findIndex((vehicle) => vehicle.vehicle_id === parseInt(id, 10));

      if (indexToDelete !== -1) {
        this.vehicles.splice(indexToDelete, 1);
        resolve();
      } else {
        reject(new Error(`Vehicle with ID ${id} not found for deletion`));
      }
    });
  }
}
