Certainly! Here's the formatted text:


# Customs Freight Company System

## Project Overview

This project involves designing a system for a Customs Freight Company that manages three types of vehicles: Cargo Planes, In-city trucks, and Long-haul trucks. The system should keep track of specific attributes for each vehicle, including brand, load, capacity, year, and the number of repairs.

## Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (including npm)
- An environment manager (optional but recommended)

### Starting Development

1. Validate that you have Node and NPM installed by running the following commands:

    ```bash
    node -v
    npm -v
    ```

    Ensure that you see the version numbers.

2. Install the required dependencies:

    ```bash
    npm install
    ```

    Install the npm package:

    ```bash
    npm install typeorm --save
    ```

    You need to install reflect-metadata shim:

    ```bash
    npm install reflect-metadata --save
    ```

    and import it somewhere in the global place of your app (for example in app.ts):

    ```typescript
    import "reflect-metadata"
    ```

    You may need to install node typings:

    ```bash
    npm install @types/node --save-dev
    ```

    Run the npm Install Command:

    ```bash
    npm install --save-dev @types/jest
    ```

3. Start the development environment:

    ```bash
    npm start
    ```

### Tests

Run tests with:


npm run test


## Docker Setup

### Prerequisites

Ensure you have [Docker](https://www.docker.com/get-started) installed on your machine.

**Start Docker Desktop**

### Using Docker Compose

1. Navigate to the Docker Compose directory.

2. Build the Docker image:

    ```bash
    docker-compose up --build
    ```

3. Run the Docker image:

    ```bash
    docker-compose up -d
    ```

4. Build and run the Docker image:

    ```bash
    docker-compose up -d --build
    ```

This setup allows you to run the Customs Freight Company system within a Docker container.

**Note:** Make sure to consult the official documentation for Docker and Docker Compose for additional troubleshooting or version-specific instructions.



I've formatted the text using markdown syntax for better readability.
