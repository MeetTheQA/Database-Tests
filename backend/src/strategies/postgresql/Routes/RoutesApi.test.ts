

import { DataConnector, postgresDataSource } from "../configure";
import { Routes } from "./Routes";
import RoutesApi, { Options, RoutesApiDataConnector } from "./RoutesApi";

describe("routes api test", () => {
  test("get", async () => {
    const routeApi = new RoutesApi(new MockRoutesApiDataConnector());

    const result = await routeApi.get("1234");

    expect(result).toHaveLength(0);
  });


  test("delete method throws an error when route is not found", async () => {
    const routeApi = new RoutesApi(new MockRoutesApiDataConnector());
    await expect(routeApi.delete("1")).rejects.toThrow("Route with the given ID not found"); 
  });

  test("delete", async () => {
    const routeApi = new RoutesApi(new MockRoutesApiDataConnector());
    await routeApi.delete("1"); 
  });

  test("should save a new route with the provided data", async () => {
    const routeApi = new RoutesApi(new MockRoutesApiDataConnector());
    await routeApi.post("Origin", "Destination", 100, 120);
    
  });
});

class MockRoutesApiDataConnector implements DataConnector<Routes, Options> {
  private routes: Routes[] = [];

  async findBy(options: Options): Promise<Routes[]> {
    return this.routes.filter((route) => route.route_id === options.id);
  }

  save(entity: Routes): void {
    this.routes.push(entity);
  }

  async update(id: string, updatedData: Partial<Routes>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const existingRouteIndex = this.routes.findIndex((route) => route.route_id === parseInt(id, 10));

      if (existingRouteIndex !== -1) {
        this.routes[existingRouteIndex] = { ...this.routes[existingRouteIndex], ...updatedData };
        resolve();
      } else {
        reject(new Error(`Route with ID ${id} not found for update`));
      }
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const indexToDelete = this.routes.findIndex((route) => route.route_id === parseInt(id, 10));

      if (indexToDelete !== -1) {
        this.routes.splice(indexToDelete, 1);
        resolve();
      } else {
        reject(new Error(`Route with ID ${id} not found for deletion`));
      }
    });
  }
}
