
import { DataConnector, postgresDataSource } from "../configure";
import { Employees } from "./Employees";
import EmployeeApi, { Options, EmployeeApiDataConnector } from "./EmployeeApi";

describe("employee api test", () => {
  test("get", async () => {
    const employeeApi = new EmployeeApi(new MockEmployeeApiDataConnector());

    const result = await employeeApi.get("1");

    expect(result).toHaveLength(0);
  });

  // Negative Test
  test("delete method throws an error when employee is not found", async () => {
    const employeeApi = new EmployeeApi(new MockEmployeeApiDataConnector());
    await expect(employeeApi.delete("1")).rejects.toThrow("Employee with the given ID not found"); 
  });

  test("delete", async () => {
    const employeeApi = new EmployeeApi(new MockEmployeeApiDataConnector());
    await employeeApi.delete("1"); 
  });

  test("should save a new employee with the provided data", async () => {
    const employeeApi = new EmployeeApi(new MockEmployeeApiDataConnector());
    await employeeApi.post("Meet", "Sheth", 2, true);
    
  });
});

class MockEmployeeApiDataConnector implements DataConnector<Employees, Options> {
  private employees: Employees[] = [];

  async findBy(options: Options): Promise<Employees[]> {
    return this.employees.filter((employee) => employee.employee_id === options.id);
  }

  save(entity: Employees): void {
    this.employees.push(entity);
  }

  async update(id: string, updatedData: Partial<Employees>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const existingEmployeeIndex = this.employees.findIndex((employee) => employee.employee_id === parseInt(id, 10));

      if (existingEmployeeIndex !== -1) {
        this.employees[existingEmployeeIndex] = { ...this.employees[existingEmployeeIndex], ...updatedData };
        resolve();
      } else {
        reject(new Error(`Employee with ID ${id} not found for update`));
      }
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const indexToDelete = this.employees.findIndex((employee) => employee.employee_id === parseInt(id, 10));

      if (indexToDelete !== -1) {
        this.employees.splice(indexToDelete, 1);
        resolve();
      } else {
        reject(new Error(`Employee with ID ${id} not found for deletion`));
      }
    });
  }
}
