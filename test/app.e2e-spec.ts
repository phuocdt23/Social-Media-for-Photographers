import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { LoginDto } from '../src/users/dto/login.dto';
// import { Connection } from 'typeorm';
const users = [
  {
    username: 'user001',
    email: 'user001@gmail.com',
    name: 'user001',
    password: '123123',
  },
  {
    username: 'user002',
    email: 'user002@gmail.com',
    name: 'user002',
    password: '123123',
  },
  {
    username: 'user003',
    email: 'user003@gmail.com',
    name: 'user003',
    password: '123123',
  },
  {
    username: 'user004',
    email: 'user004@gmail.com',
    name: 'user004',
    password: '123123',
  },
  {
    username: 'user005',
    email: 'user005@gmail.com',
    name: 'user005',
    password: '123123',
  },
  {
    username: 'user006',
    email: 'user006@gmail.com',
    name: 'user006',
    password: '123123',
  },
  {
    username: 'user007',
    email: 'user007@gmail.com',
    name: 'user007',
    password: '123123',
  },
  {
    username: 'user008',
    email: 'user008@gmail.com',
    name: 'user008',
    password: '123123',
  },
  {
    username: 'user009',
    email: 'user009@gmail.com',
    name: 'user009',
    password: '123123',
  },
  {
    username: 'user010',
    email: 'user010@gmail.com',
    name: 'user010',
    password: '123123',
  },
];

const data_test = {
  user001: {
    username: 'user001',
    email: 'user001@gmail.com',
    name: 'user001',
    password: '123123',
  },
  confictUserName: {
    username: 'user001',
    email: 'whatSoEver@gmail.com',
    name: 'user001',
    password: '123123',
  },
  confictGmail: {
    username: 'whatSoEver',
    email: 'user001@gmail.com',
    name: 'user001',
    password: '123123',
  },
};
describe('UserController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  const accessToken = [];
  for (const user of users) {
    let token: string;
    //insert 10 users into data with confirmed email
    it('[POST /users/register] Success: Created', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(user as CreateUserDto)
        .expect(201);
      token = response.body.data.tokenConfirmation;
    });

    it('[GET /users/register/:token] Success: Register', async () => {
      await request(app.getHttpServer())
        .get('/users/register/' + token)
        .expect(200);
    });

    it('[POST /users/login] Success: Login', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: user.email, password: user.password } as LoginDto)
        .expect(200);
      accessToken.push(res.body.data.accessToken);
      console.log(
        `access token user00${accessToken.length}: `,
        res.body.data.accessToken,
      );
    });
  }
  // console.log(accessToken);

  it('[POST /users/register] Fail: Confict Gmail', async () => {
    await request(app.getHttpServer())
      .post('/users/register')
      .send(data_test.confictGmail as CreateUserDto)
      .expect(409);
  });

  it('[POST /users/register] Fail: Confict Username', async () => {
    await request(app.getHttpServer())
      .post('/users/register')
      .send(data_test.confictUserName as CreateUserDto)
      .expect(409);
  });
});
// let app: INestApplication;
// //-----------------------------------------------------------------
// //User
// describe('For Route [User]', () => {
//   beforeAll(async () => {
//     //for what?
//     const moduleFixture = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     app.useGlobalPipes(new ValidationPipe());

//     await app.init();
//   });

// })
// //-----------------------------------------------------------------
// //...
// describe('For Route ...', () => {
//   beforeAll(async () => {
//     //for what?
//     const moduleFixture = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     app.useGlobalPipes(new ValidationPipe());

//     await app.init();
//   });
// })
// //-----------------------------------------------------------------
// //...
// describe('For Route ...', () => {
//   beforeAll(async () => {
//     //for what?
//     const moduleFixture = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     app.useGlobalPipes(new ValidationPipe());

//     await app.init();
//   });
// })
// //-----------------------------------------------------------------
// //...
// describe('For Route ...', () => {
//   beforeAll(async () => {
//     //for what?
//     const moduleFixture = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     app.useGlobalPipes(new ValidationPipe());

//     await app.init();
//   });
// })
// //-----------------------------------------------------------------
// //...
// describe('For Route ...', () => {
//   beforeAll(async () => {
//     //for what?
//     const moduleFixture = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     app.useGlobalPipes(new ValidationPipe());

//     await app.init();
//   });
// })
// //-----------------------------------------------------------------
// //...
// describe('For Route ...', () => {
//   beforeAll(async () => {
//     //for what?
//     const moduleFixture = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     app.useGlobalPipes(new ValidationPipe());

//     await app.init();
//   });
// })

// import type { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { UsersModule } from '../src/users/users.module';
// import request from 'supertest';

// import { AppModule } from '../src/app.module';

// describe('AuthController (e2e)', () => {
//   let app: INestApplication;
//   let accessToken: string;

//   beforeAll(async () => {
//     const moduleFixture = await Test.createTestingModule({
//       imports: [AppModule,UsersModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/users/register [POST]', () =>
//     request(app.getHttpServer())
//       .post('/users/register')
//       .send({
//         name: 'usertest001',
//         username: 'usertest001',
//         email: 'usertest001@gmail.com',
//         password: 'password',
//       })
//       .expect(201));

//   it('/users/login [POST]', async () => {
//     const response = await request(app.getHttpServer())
//       .post('/users/login')
//       .send({
//         email: 'usertest001@gmail.com',
//         password: 'password',
//       })
//       .expect(200);

//     accessToken = response.body.token.accessToken;
//   });

//   afterAll(() => app.close());
// });
