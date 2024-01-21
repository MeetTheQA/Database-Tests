
import cors from "cors";
import express, { json } from "express";
import CustomersApi, { CustomersApiDataConnector } from "./strategies/postgresql/Customers/CustomersApi";
import { DataSource } from "typeorm";
import { postgresDataSource } from "./strategies/postgresql/configure";
import { EmployeeApiDataConnector } from "./strategies/postgresql/Employee/EmployeeApi";
 
async function startServer() {
    const app = express();
    app.use(cors());
    app.use(json());

    const dataSource = await postgresDataSource.initialize();

    const DataConnector = new CustomersApiDataConnector(dataSource);
    new CustomersApi(DataConnector);


 
    app.listen(8000, () => console.log("express server ready at 8000"));
}
 
startServer().catch(error => console.error(error));



