import { existsSync } from 'node:fs';
import { DataSource } from 'typeorm';
import { Maintenance } from '../maintenances/entities/maintenances.entity.js';
import { Mechanic } from '../mechanics/entities/mechanic.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Vehicle } from '../vehicles/entities/vehicle.entity.js';
import { Workshop } from '../workshops/entities/workshop.entity.js';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} es requerida para conectar TypeORM`);
  }
  return value;
}

const port = Number(process.env.DB_PORT ?? '5432');
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('DB_PORT debe ser un puerto válido entre 1 y 65535');
}

export default new DataSource({
  type: 'postgres',
  host: getRequiredEnvironmentVariable('DB_HOST'),
  port,
  username: getRequiredEnvironmentVariable('DB_USERNAME'),
  password: getRequiredEnvironmentVariable('DB_PASSWORD'),
  database: getRequiredEnvironmentVariable('DB_NAME'),
  entities: [Maintenance, Mechanic, User, Vehicle, Workshop],
  synchronize: false,
});