
import { DataConnector, postgresDataSource } from "../configure";
import { Customers } from "./Customers";
import CustomersApi, { Options, CustomersApiDataConnector } from "./CustomersApi";

describe("customers api test", () => {
  test("get", async () => {
    const customerApi = new CustomersApi(new MockCustomersApiDataConnector());
    const result = await customerApi.get("1");
    expect(result).toHaveLength(1);
  });



  test("get method throws an error when id is empty", async () => {
    
    const dataSource = postgresDataSource; 
    const customerApi = new CustomersApi(new CustomersApiDataConnector(dataSource));

    const customersData = await dataSource.manager.find(Customers, {});
    const randomCustomerId = customersData.length > 0 ? customersData[0].customer_id : 4; 

    await expect(customerApi.get("")).rejects.toThrow("id cannot be an empty string");

    await expect(customerApi.get((randomCustomerId + 1).toString())).rejects.toThrow(
      `Customer with the given ID not found`
    );
  });

  // Negative Test
  test("delete method throws an error when customer is not found", async () => {
    const customerApi = new CustomersApi(new MockCustomersApiDataConnector());
    await expect(customerApi.delete("5")).rejects.toThrow("Customer with the given ID not found"); 
  });

  test("delete", async () => {
    const customerApi = new CustomersApi(new MockCustomersApiDataConnector());
    await customerApi.delete("1"); // Assuming an ID to delete
  });

  test("should save a new customer with the provided data", async () => {
    const customerApi = new CustomersApi(new MockCustomersApiDataConnector());
    await customerApi.post("Test Name", "Test Address", "1234567890", "0987654321");
    // Add assertions here to verify that the customer was saved correctly
  });

});

class MockCustomersApiDataConnector implements DataConnector<Customers, Options> {
  private customers: Customers[] = [];

  async findBy(options: Options): Promise<Customers[]> {
    return this.customers.filter((customer) => customer.customer_id === options.id);
  }

  save(entity: Customers): void {
    this.customers.push(entity);
  } 

  getLastSavedCustomer(): Customers | undefined {
    return this.customers.length > 0 ? this.customers[this.customers.length - 1] : undefined;
  }



  async update(id: string, updatedData: Partial<Customers>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const existingCustomerIndex = this.customers.findIndex((customer) => customer.customer_id === parseInt(id, 10));

      if (existingCustomerIndex !== -1) {
        this.customers[existingCustomerIndex] = { ...this.customers[existingCustomerIndex], ...updatedData };
        resolve();
      } else {
        reject(new Error(`Customer with ID ${id} not found for update`));
      }
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const indexToDelete = this.customers.findIndex((customer) => customer.customer_id === parseInt(id, 10));

      if (indexToDelete !== -1) {
        this.customers.splice(indexToDelete, 1);
        resolve();
      } else {
        reject(new Error(`Customer with ID ${id} not found`));
      }
    });
  }
}

