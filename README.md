# FleetCore API

**FleetCore** is a backend API for managing vehicle maintenance operations. It is built with NestJS and TypeScript and uses PostgreSQL for data persistence.

The project includes authentication, role-based access control, and modules for managing users, vehicles, mechanics, workshops, and maintenance records.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the API](#running-the-api)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Available Endpoints](#available-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Security Notes](#security-notes)

## Features

- User registration and login.
- Password hashing with Argon2.
- JWT-based authentication.
- Role-based access control.
- User management.
- Vehicle management.
- Mechanic management.
- Workshop management.
- Vehicle maintenance management.
- PostgreSQL database integration.
- Request validation using `class-validator`.
- API documentation with Swagger.
- Docker-based development environment.

## Technologies

| Technology     | Purpose                                    |
| -------------- | ------------------------------------------ |
| NestJS         | Backend application framework              |
| TypeScript     | Programming language                       |
| Node.js        | JavaScript runtime                         |
| PostgreSQL     | Relational database                        |
| TypeORM        | Database integration and entity management |
| JWT            | Authentication tokens                      |
| Argon2         | Password hashing                           |
| Docker Compose | Container orchestration                    |
| Swagger        | API documentation                          |
| Postman        | API testing                                |

## Project Structure

```text
fleetcore-api/
├── src/
│   ├── auth/
│   │   ├── Dto/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/
│   ├── vehicles/
│   ├── mechanics/
│   ├── workshops/
│   ├── maintenances/
│   ├── Data/
│   ├── Cammon/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

**Main directories:**

- `auth/`: user registration, login, and JWT authentication.
- `users/`: user management.
- `vehicles/`: vehicle-related functionality.
- `mechanics/`: mechanic management.
- `workshops/`: workshop-related functionality.
- `maintenances/`: vehicle maintenance functionality.
- `Data/`: database configuration.
- `Cammon/`: shared components, including guards, decorators, and role definitions.

## Requirements

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- Docker Compose
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) (optional, for API testing)

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd fleetcore-api
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual repository URL.

### 2. Configure environment variables

Create a local `.env` file using the variables required by the application.

Example configuration:

```env
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_local_password
DB_DATABASE=fleetcore_db
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=1d
```

The variable names and values must match the application's actual configuration. Do not commit real credentials or production secrets.

### 3. Start the application with Docker

```bash
docker compose up --build -d
```

Check the containers:

```bash
docker compose ps
```

View the API logs:

```bash
docker compose logs -f api
```

Stop the containers:

```bash
docker compose down
```

To stop the containers while keeping the database volume, do not add the `-v` option.

## Environment Variables

| Variable         | Description              |
| ---------------- | ------------------------ |
| `PORT`           | Internal API port        |
| `DB_HOST`        | Database hostname        |
| `DB_PORT`        | PostgreSQL port          |
| `DB_USERNAME`    | Database username        |
| `DB_PASSWORD`    | Database password        |
| `DB_DATABASE`    | Database name            |
| `JWT_SECRET`     | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT expiration time      |

These are example variable names. Verify them against the application's database configuration and Docker Compose file before deployment.

## Running the API

In the local Docker configuration used during development, the API is exposed on port `3002`, while NestJS listens internally on port `3000`.

Base URL:

```text
http://localhost:3002/api
```

Swagger documentation:

```text
http://localhost:3002/api/docs
```

If your Docker port mapping changes, update these URLs accordingly.

## API Documentation

Swagger provides an interactive interface for exploring the available routes and testing requests.

Open:

```text
http://localhost:3002/api/docs
```

The application uses a global `api` prefix for its routes.

## Authentication

FleetCore uses JWT authentication.

### Register a user

**Method:** `POST`

```text
/api/auth/register
```

Example JSON body:

```json
{
  "name": "Admin Example",
  "email": "admin@example.com",
  "password": "ExamplePassword123!",
  "role": "ADMIN"
}
```

The registration DTO requires a name, email, password, and role. The password must contain at least six characters.

### Log in

**Method:** `POST`

```text
/api/auth/login
```

Example JSON body:

```json
{
  "email": "admin@example.com",
  "password": "ExamplePassword123!"
}
```

A successful login returns an access token and user information.

Use the token in protected requests:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Available Endpoints

The following routes are confirmed from the current controller configuration.

| Method | Endpoint             | Access                     |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/auth/register` | Public                     |
| POST   | `/api/auth/login`    | Public                     |
| POST   | `/api/mechanics`     | Admin                      |
| GET    | `/api/mechanics`     | Admin, Manager             |
| GET    | `/api/mechanics/:id` | Admin, Manager, Technician |
| PUT    | `/api/mechanics/:id` | Admin                      |
| DELETE | `/api/mechanics/:id` | Admin                      |

The mechanics endpoints require JWT authentication and role authorization. Other module routes should be checked in Swagger.

### Available roles

- `ADMIN`: administrative access to protected operations.
- `MANAGER`: access to selected management operations.
- `TECHNICIAN`: access to selected technical operations.

Actual permissions depend on the guards and role decorators configured for each endpoint.

## Testing with Postman

1. Open Postman and create a new request.
2. Use the local base URL `http://localhost:3002/api`.
3. Register a test user or log in with an existing account.
4. Copy the returned `accessToken`.
5. Open a protected endpoint, such as `POST /mechanics`.
6. Select **Authorization → Bearer Token**.
7. Paste the token.
8. Select **Body → raw → JSON** and provide the required fields.
9. Click **Send** and inspect the response.

For mechanic creation, an example request body is:

```json
{
  "name": "Mechanic Example",
  "email": "mechanic@example.com",
  "specialty": "Engine"
}
```

A successful response indicates that the request was accepted. Verify the database or use an available GET endpoint to confirm persistence.

## Security Notes

- Do not commit `.env` files containing real credentials.
- Do not expose JWT secrets or access tokens.
- Public registration should not allow users to assign themselves the `ADMIN` role in production.
- Use strong secrets and appropriate database credentials.
- Restrict database access in production.
- Validate and authorize protected requests.

## Project Status

FleetCore API is under development. Features and endpoints may change as the project evolves.

## Author

**Jonathan Rodriguez**

CLAN: node.js and nest.js PM

