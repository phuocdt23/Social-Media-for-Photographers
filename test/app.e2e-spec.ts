import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

const data_test = {
  user001: {
    username: 'willBeChanged',
    email: 'willBeChanged@gmail.com',
    name: 'willBeChanged',
    password: 'willbechanged',
  },
  confictUserName: {
    username: 'willBeChanged',
    email: 'whatSoEver@gmail.com',
    name: 'willBeChanged',
    password: 'willbechanged',
  },
  confictGmail: {
    username: 'whatSoEver',
    email: 'willBeChanged@gmail.com',
    name: 'willBeChanged',
    password: 'willbechanged',
  },
};
//   user002: {
//     username: 'user002',
//     email: 'user002@gmail.com',
//     name: 'user002',
//     password: '123123',
//   },
//   user003: {
//     username: 'user003',
//     email: 'user003@gmail.com',
//     name: 'user003',
//     password: '123123',
//   },
//   user004: {
//     username: 'user004',
//     email: 'user004@gmail.com',
//     name: 'user004',
//     password: '123123',
//   },
//   user005: {
//     username: 'user005',
//     email: 'user005@gmail.com',
//     name: 'user005',
//     password: '123123',
//   },
//   user006: {
//     username: 'user006',
//     email: 'user006@gmail.com',
//     name: 'user006',
//     password: '123123',
//   },
//   user007: {
//     username: 'user007',
//     email: 'user007@gmail.com',
//     name: 'user007',
//     password: '123123',
//   },
//   user008: {
//     username: 'user008',
//     email: 'user008@gmail.com',
//     name: 'user008',
//     password: '123123',
//   },
//   user009: {
//     username: 'user009',
//     email: 'user009@gmail.com',
//     name: 'user009',
//     password: '123123',
//   },
//   user010: {
//     username: 'user010',
//     email: 'user010@gmail.com',
//     name: 'user010',
//     password: '123123',
//   },

//   userUpdate1: {
//     username: 'user001',
//     email: 'user001@gmail.com',
//     name: 'user001'
//   },

//   userChangePassword1: {
//     currentPassword: 'willbechanged',
//     newPassword: '123123',
//   },

//   album1: {
//     name: 'willBeChangeName1',
//     description: 'will Be Change Description 1',
//   },

//   albumUpdate: {
//     name: `user001's Album1`,
//     description: `user001's description1`,
//   },

//   photo: {
//     name: 'Mua he chuyen lanh',
//   },

//   photoUpdate: {
//     caption: 'Mot ngay hai ngay ba ngay',
//     status: 'Private',
//   },

//   comments: {
//     comment: 'Anh nay dep dep',
//   },

//   commentUpdates: {
//     commentUpdate: 'Cute is not FoUND',
//   },
// };
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

  //register
  it('[POST /users/register] Success: Created', async () => {
    console.log('register test');
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send(data_test.user001 as CreateUserDto)
      .expect(201);
  });

  it('[POST /users/register] Fail: Confict Gmail', async () => {
    await request(app.getHttpServer())
      .post('/users/register')
      .send(data_test.user001 as CreateUserDto)
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
