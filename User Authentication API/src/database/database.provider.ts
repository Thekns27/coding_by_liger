


import { User } from 'src/users/entities/users.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'Thek',
        database: 'UAApi',
        entities: [User],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
