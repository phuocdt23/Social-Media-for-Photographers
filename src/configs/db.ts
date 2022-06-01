import { config, DotenvConfigOutput } from 'dotenv';
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
  entities: ['dist/**/**/*.entity{.ts,.js}'],
  synchronize: true,
};
const dbTest = {
  type: String(process.env.DB_TYPE),
  host: String(process.env.DB_HOST),
  post: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_TEST),
  entities: ['dist/**/**/*.entity{.ts,.js}'],
  synchronize: true,
};
const db = process.env.NODE_ENV === 'test' ? dbTest : dbDev;
export const configs = {
  db,
};

// export const configs = {
//     // pagination: {
//     //   page: 1,
//     //   recordsAPage: 20,
//     // },
//     host: process.env.HOST,
//     port: process.env.PORT,
//     emailHelper: process.env.EMAIL,
//     emailPassword: process.env.PASSWORD_EMAIL,
//     db,
// };
