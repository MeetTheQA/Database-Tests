
import { DataConnector, postgresDataSource } from "../configure";
import { Trips } from "./Trips";
import TripsApi, { Options, TripsApiDataConnector } from "./TripsApi";

describe("trips api test", () => {
  test("get", async () => {
    const tripApi = new TripsApi(new MockTripsApiDataConnector());

    const result = await tripApi.get("1234");

    expect(result).toHaveLength(0);
  });


  test("delete method throws an error when trip is not found", async () => {
    const tripApi = new TripsApi(new MockTripsApiDataConnector());
    await expect(tripApi.delete("1")).rejects.toThrow("Trip with the given ID not found");
  });

  test("delete", async () => {
    const tripApi = new TripsApi(new MockTripsApiDataConnector());
    await tripApi.delete("1"); 
  });

  test("should save a new trip with the provided data", async () => {
    const tripApi = new TripsApi(new MockTripsApiDataConnector());
    await tripApi.post(1, 2, 3, 4, 5);
  });
});

class MockTripsApiDataConnector implements DataConnector<Trips, Options> {
  private trips: Trips[] = [];

  async findBy(options: Options): Promise<Trips[]> {
    return this.trips.filter((trip) => trip.trip_id === options.id);
  }

  save(entity: Trips): void {
    this.trips.push(entity);
  }

  async update(id: string, updatedData: Partial<Trips>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const existingTripIndex = this.trips.findIndex((trip) => trip.trip_id === parseInt(id, 10));

      if (existingTripIndex !== -1) {
        this.trips[existingTripIndex] = { ...this.trips[existingTripIndex], ...updatedData };
        resolve();
      } else {
        reject(new Error(`Trip with ID ${id} not found for update`));
      }
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const indexToDelete = this.trips.findIndex((trip) => trip.trip_id === parseInt(id, 10));

      if (indexToDelete !== -1) {
        this.trips.splice(indexToDelete, 1);
        resolve();
      } else {
        reject(new Error(`Trip with ID ${id} not found for deletion`));
      }
    });
  }
}
