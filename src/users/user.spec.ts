import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { AppModule } from '../src/app.module';
// import { CreateUserDto } from '../src/users/dto/create-user.dto';
// import { LoginDto } from '../src/users/dto/login.dto';
// import { UpdatePasswordDto } from '../src/users/dto/update-password.dto';
// import { UpdateUserDto } from '../src/users/dto/update-user.dto';
const users = [
  {
    username: 'user001',
    email: 'user001@gmail.com',
    name: 'user001',
    password: 'willbechange',
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
    username: 'willbechanged',
    email: 'willbechanged@gmail.com',
    name: 'willbechanged',
    password: '123123',
  },
];

const data_test = {
  changedInfo: {
    username: 'user010',
    email: 'user010@gmail.com',
    name: 'user010',
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
  expiredToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlcjAwMSIsImVtYWlsIjoidXNlcjAwMUBnbWFpbC5jb20iLCJpZCI6ImUzZjA5MDUwLTA5MGMtNDZiZi1hN2VjLWY5ODVhNjg4MGMzZCIsImlhdCI6MTY1NDE1MDU3NywiZXhwIjoxNjU0MTU0MTc3fQ.YH2grPzwejageFSr-I7iRFHn2FnyEc3xwR1G39YtWSg`,
  invalidSignature: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlcjAwMSIsImVtYWlsIjoidXNlcjAwMUBnbWFpbC5jb20iLCJpZCI6IjdhYWY0Yzg0LWY4NTQtNGM2OS1hZGQ4LTczNmNjMjBhYTFhZiIsImlhdCI6MTY1NDE1Mjg1OCwiZXhwIjoxNjU0MTU2NDU4fQ.hBW9RKRHvuK3ypjm5Oik4XxrNUjH2o6IHyiP6HKH8WW`,
  successChangePassword: {
    currentPassword: 'willbechange',
    newPassword: '123123',
  },
  failNotChangePassword: {
    currentPassword: '123123',
    newPassword: '123123',
  },
  invalidCurrentPassword: {
    currentPassword: 'wrongPassword',
    newPassword: 'whatever!',
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

  //insert 10 users into database
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
  it('[GET /users] Success: Get Infor User', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set({ authorization: `Bearer ${accessToken[0]}` })
      .expect(200);
  });
  // it('[PATCH /users] Success: Change Infor User', async () => {
  //   await request(app.getHttpServer())
  //     .patch('/users')
  //     .set({ authorization: `Bearer ${accessToken[accessToken.length - 1]}` })
  //     .send(data_test.changedInfo as UpdateUserDto)
  //     .expect({
  //       message: 'Change Successfully!',
  //       status: 200,
  //     });
  // })
  it('[POST /users/change-password] Fail: Invalid Current Password', async () => {
    await request(app.getHttpServer())
      .post('/users/change-password')
      .set({ authorization: `Bearer ${accessToken[0]}` })
      .send(data_test.invalidCurrentPassword as UpdatePasswordDto)
      .expect(400);
  });
  it('[Post /users/change-password] Fail: The New Password The Same As Old Password', async () => {
    const rs = await request(app.getHttpServer())
      .post('/users/change-password')
      .set({ authorization: `Bearer ${accessToken[0]}` })
      .send(data_test.failNotChangePassword as UpdatePasswordDto)
      .expect(400);
  });
  // it('[Post /users/change-password] Success: Change Password', async () => {
  //   const rs = await request(app.getHttpServer())
  //     .patch('/users/change-password')
  //     .set({ authorization: `Bearer ${accessToken[0]}` })
  //     .send(data_test.successChangePassword as UpdatePasswordDto)
  //     .expect(200);
  //   console.log(`rs:`, rs);
  // })

  //Test for jwt-middleware
  it('[GET /users] Fail: Jwt Malformed', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set({ authorization: `Bearer abcxyz` })
      .expect({
        name: 'JsonWebTokenError',
        message: 'jwt malformed',
      });
  });
  it('[GET /users] Fail: Invalid Signature', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set({ authorization: `Bearer ${data_test.invalidSignature}` })
      .expect({
        name: 'JsonWebTokenError',
        message: 'invalid signature',
      });
  });
  it('[GET /users] Fail: Do Not Have Token', async () => {
    await request(app.getHttpServer()).get('/users').expect({
      message: 'Please Login To Access Resource!(do not have token!)',
      status: 400,
      data: {},
    });
  });
  it('[GET /users] Fail: Expired Token', async () => {
    await request(app.getHttpServer())
      .get('/users')
      .set({ authorization: `Bearer ${data_test.expiredToken}` })
      .expect(401);
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
