import { User } from 'src/users/entities/users.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'Thek',
        database: 'authentication_api',
        entities: [User],
        migrations: ['src/migrations/*.ts'],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
