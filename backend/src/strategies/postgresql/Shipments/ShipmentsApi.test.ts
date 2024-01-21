
import { DataConnector, postgresDataSource } from "../configure";
import { Shipments } from "./Shipments";
import ShipmentsApi, { Options, ShipmentsApiDataConnector } from "./ShipmentsApi";

describe("shipments api test", () => {
  test("get", async () => {
    const shipmentApi = new ShipmentsApi(new MockShipmentsApiDataConnector());

    const result = await shipmentApi.get("1234");

    expect(result).toHaveLength(0);
  });



  test("delete method throws an error when shipment is not found", async () => {
    const shipmentApi = new ShipmentsApi(new MockShipmentsApiDataConnector());
    await expect(shipmentApi.delete("1")).rejects.toThrow("Shipment with the given ID not found"); 
  });

  test("delete", async () => {
    const shipmentApi = new ShipmentsApi(new MockShipmentsApiDataConnector());
    await shipmentApi.delete("1"); 
  });

  test("should save a new shipment with the provided data", async () => {
    const shipmentApi = new ShipmentsApi(new MockShipmentsApiDataConnector());
    await shipmentApi.post(1, "Test Shipment", 10, 100);
  });
});

class MockShipmentsApiDataConnector implements DataConnector<Shipments, Options> {
  private shipments: Shipments[] = [];

  async findBy(options: Options): Promise<Shipments[]> {
    return this.shipments.filter((shipment) => shipment.shipment_id === options.id);
  }

  save(entity: Shipments): void {
    this.shipments.push(entity);
  }

  async update(id: string, updatedData: Partial<Shipments>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const existingShipmentIndex = this.shipments.findIndex((shipment) => shipment.shipment_id === parseInt(id, 10));

      if (existingShipmentIndex !== -1) {
        this.shipments[existingShipmentIndex] = { ...this.shipments[existingShipmentIndex], ...updatedData };
        resolve();
      } else {
        reject(new Error(`Shipment with ID ${id} not found for update`));
      }
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const indexToDelete = this.shipments.findIndex((shipment) => shipment.shipment_id === parseInt(id, 10));

      if (indexToDelete !== -1) {
        this.shipments.splice(indexToDelete, 1);
        resolve();
      } else {
        reject(new Error(`Shipment with ID ${id} not found for deletion`));
      }
    });
  }
}
