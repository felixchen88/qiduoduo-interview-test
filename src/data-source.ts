import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from './entity/user.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [UserEntity],
  synchronize: true,
  logging: true,
});

export const initAppDataSource = async () => {
  await AppDataSource.initialize();
};
