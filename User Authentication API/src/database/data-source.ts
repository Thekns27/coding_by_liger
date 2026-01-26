

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/users.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Thek',
  database: 'authentication_api',
  entities: [User],
  migrations: ['src/database/migrations/*.{ts,js}'],
  synchronize: false,
});
