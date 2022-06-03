import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {data_test} from '../configs/data_test';

export const accessToken = [];
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

  //insert 10 users into database
  for (const user of data_test.users) {
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
  it('[PATCH /users] Success: Change Infor User', async () => {
    await request(app.getHttpServer())
      .patch('/users')
      .set({ authorization: `Bearer ${accessToken[accessToken.length - 1]}` })
      .send(data_test.changedInfo as UpdateUserDto)
      .expect(200);
  })
  it('[POST /users/change-password] Fail: Invalid Current Password', async () => {
    await request(app.getHttpServer())
      .post('/users/change-password')
      .set({ authorization: `Bearer ${accessToken[0]}` })
      .send(data_test.invalidCurrentPassword as UpdatePasswordDto)
      .expect(400);
  });
  it('[POST /users/change-password] Fail: The New Password The Same As Old Password', async () => {
    const rs = await request(app.getHttpServer())
      .post('/users/change-password')
      .set({ authorization: `Bearer ${accessToken[0]}` })
      .send(data_test.failNotChangePassword as UpdatePasswordDto)
      .expect(400);
  });
  it('[POST /users/change-password] Success: Update Password', async () => {
    const rs = await request(app.getHttpServer())
      .post('/users/change-password')
      .set({ authorization: `Bearer ${accessToken[0]}` })
      .send(data_test.successChangePassword as UpdatePasswordDto)
      .expect(200);
  })
  it('[POST /users/forgot-password] Success: Send Mail Attach With Reset Password', async () => {
    const rs = await request(app.getHttpServer())
      .post('/users/forgot-password')
      .set({ authorization: `Bearer ${accessToken[accessToken.length - 1]}` })
      .send({email: data_test.users[data_test.users.length - 1].email} as ForgotPasswordDto)
      .expect(200);
  })

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
