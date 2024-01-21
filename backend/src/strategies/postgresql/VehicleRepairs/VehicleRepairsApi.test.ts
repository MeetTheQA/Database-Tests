
import { DataConnector, postgresDataSource } from "../configure";
import { VehicleRepairs } from "./VehicleRepairs";
import VehicleRepairsApi, { Options, VehicleRepairsApiDataConnector } from "./VehicleRepairsApi";

describe("vehicle repairs api test", () => {
  test("get", async () => {
    const repairApi = new VehicleRepairsApi(new MockVehicleRepairApiDataConnector());

    const result = await repairApi.get("1234");

    expect(result).toHaveLength(0);
  });



  test("delete method throws an error when repair is not found", async () => {
    const repairApi = new VehicleRepairsApi(new MockVehicleRepairApiDataConnector());
    await expect(repairApi.delete("1")).rejects.toThrow("Repair with the given ID not found"); 
  });

  test("delete", async () => {
    const repairApi = new VehicleRepairsApi(new MockVehicleRepairApiDataConnector());
    await repairApi.delete("1");
  });

  test("should save a new repair with the provided data", async () => {
    const repairApi = new VehicleRepairsApi(new MockVehicleRepairApiDataConnector());
    await repairApi.post(1, 2, 3, 4);
  });
});

class MockVehicleRepairApiDataConnector implements DataConnector<VehicleRepairs, Options> {
  private repairs: VehicleRepairs[] = [];

  async findBy(options: Options): Promise<VehicleRepairs[]> {
    return this.repairs.filter((repair) => repair.repair_id === options.id);
  }

  save(entity: VehicleRepairs): void {
    this.repairs.push(entity);
  }

  async update(id: string, updatedData: Partial<VehicleRepairs>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const existingRepairIndex = this.repairs.findIndex((repair) => repair.repair_id === parseInt(id, 10));

      if (existingRepairIndex !== -1) {
        this.repairs[existingRepairIndex] = { ...this.repairs[existingRepairIndex], ...updatedData };
        resolve();
      } else {
        reject(new Error(`Repair with ID ${id} not found for update`));
      }
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const indexToDelete = this.repairs.findIndex((repair) => repair.repair_id === parseInt(id, 10));

      if (indexToDelete !== -1) {
        this.repairs.splice(indexToDelete, 1);
        resolve();
      } else {
        reject(new Error(`Repair with ID ${id} not found for deletion`));
      }
    });
  }
}
