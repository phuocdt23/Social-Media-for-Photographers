import { config, DotenvConfigOutput } from 'dotenv';
import { join } from 'path';
const envFound: DotenvConfigOutput = config();
if (!envFound) {
  throw new Error('.env file was not found.');
}

const dbDev = {
  type: String(process.env.DB_TYPE),
  host: String(process.env.DB_HOST),
  post: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DEV),
  entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
  // entities: ['dist/**/**/*.entity{.ts,.js}'],//  RepositoryNotFoundError: No repository for "User" was found. Looks like this entity is not registered in current "default" connection?
  synchronize: true,
};
const dbTest = {
  type: String(process.env.DB_TYPE),
  host: String(process.env.DB_HOST),
  post: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_TEST),
  // entities: ['dist/**/**/*.entity{.ts,.js}'],
  entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
  synchronize: true,
};
const db = process.env.NODE_ENV === 'test' ? dbTest : dbDev;
export const configs = {
  db,
};
