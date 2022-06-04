import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { data_test } from '../configs/data_test';

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
  });
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
  });
  it('[POST /users/forgot-password] Success: Send Mail Attach With Reset Password', async () => {
    const rs = await request(app.getHttpServer())
      .post('/users/forgot-password')
      .set({ authorization: `Bearer ${accessToken[accessToken.length - 1]}` })
      .send({
        email: data_test.users[data_test.users.length - 1].email,
      } as ForgotPasswordDto)
      .expect(200);
  });

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
// describe(`AlbumController (e2e)`, () => {
//   let app: INestApplication;
//   beforeAll(async () => {
//       const moduleFixture = await Test.createTestingModule({
//           imports: [AppModule],
//       }).compile();
//       app = moduleFixture.createNestApplication();
//       app.useGlobalPipes(new ValidationPipe());
//       await app.init();
//       jest.setTimeout(5000);
//   })

//   let tokenUser002: string;
//   let tokenUser003: string;
//   let albumIdOfUser002: string;
//   let inviteToken: string;
//   let albumUser002: Object[];

//   //login account
//   it('[POST /users/login]', async () => {
//       const rs = await request(app.getHttpServer())
//           .post('/users/login')
//           .send({ email: data_test.users[1].email, password: data_test.users[1].password } as LoginDto)
//           .expect(200);
//           tokenUser002 = rs.body.data.accessToken;
//   })
//   it('[POST /users/login]', async () => {
//       const rs = await request(app.getHttpServer())
//           .post('/users/login')
//           .send({ email: data_test.users[2].email, password: data_test.users[2].password } as LoginDto)
//           .expect(200);
//       tokenUser003= rs.body.data.accessToken;
//   })
//   it('[POST /albums] Success: Create Album', async () => {
//       const rs = await request(app.getHttpServer())
//           .post('/albums')
//           .set({ authorization: `Bearer ${tokenUser002}` })
//           .send(data_test.albumTestData.successCreateAlbum1 as CreateAlbumDto)
//           .expect(200);
//       albumIdOfUser002 = rs.body.data.id;
//   })
//   it('[POST /albums/inviteToAlbum] Success: Invite Become Contributor', async () => {
//       const rs = await request(app.getHttpServer())
//           .post('/albums/inviteToAlbum')
//           .set({ authorization: `Bearer ${tokenUser002}` })
//           .send({ username: 'user003', albumId: albumIdOfUser002 } as InviteToAlbum)
//           .expect(200);
//           inviteToken = rs.body.data.inviteToken
//   })
//   it('[POST /albums/inviteToAlbum] Fail: Invalid Username', async () => {
//       await request(app.getHttpServer())
//           .post('/albums/inviteToAlbum')
//           .set({ authorization: `Bearer ${tokenUser002}` })
//           .send({ username: 'wrongUsername', albumId: albumIdOfUser002 } as InviteToAlbum)
//           .expect(404);
//   })
//   it('[POST /albums/inviteToAlbum] Fail: Invalid AlbumId', async () => {
//       await request(app.getHttpServer())
//           .post('/albums/inviteToAlbum')
//           .set({ authorization: `Bearer ${tokenUser002}` })
//           .send({ username: 'user003', albumId: `${albumIdOfUser002.slice(0,albumIdOfUser002.length-1)}n` } as InviteToAlbum)
//           .expect(404);
//   })
//   it('[GET /albums/handleInviation/:token] Success: Invite Become Contributor', async () => {
//       await request(app.getHttpServer())
//           .get(`/albums/handleInviation/${inviteToken}`)
//           .expect(200);
//   })
//   it(`[GET /albums] Success: Get All User's Album`, async () => {
//       const res = await request(app.getHttpServer())
//           .get(`/albums`)
//           .set({authorization: `Bearer ${tokenUser002}`})
//           .expect(200);
//       albumUser002 = res.body.data;
//   })
//   it(`[GET /albums/allAlbumJoined] Success: Get All User's Album`, async () => {
//       const res = await request(app.getHttpServer())
//           .get(`/albums/allAlbumJoined`)
//           .set({authorization: `Bearer ${tokenUser002}`})
//           .expect(200);
//   })
//   it(`[GET /albums/:id] Success: Get All User's Album`, async () => {
//       const res = await request(app.getHttpServer())
//           .get(`/albums/allAlbumJoined`)
//           .set({authorization: `Bearer ${tokenUser002}`})
//           .expect(200);
//   })
//   it(`[PATCH /albums/:id] Success: Change Infor Album`, async () => {
//       const res = await request(app.getHttpServer())
//           .patch(`/albums/${albumIdOfUser002}`)
//           .set({authorization: `Bearer ${tokenUser002}`})
//           .send(data_test.albumTestData.changedNameAlbum1 as UpdateAlbumDto)
//           .expect(200);
//   })
//   it(`[DELETE /albums/:id] Fail: Delete An Album`, async () => {
//       const res = await request(app.getHttpServer())
//           .delete(`/albums/${albumIdOfUser002}`)
//           .set({authorization: `Bearer ${tokenUser003}`})
//           .expect(401);
//   })
//   it(`[DELETE /albums/:id] Success: Delete An Album`, async () => {
//       const res = await request(app.getHttpServer())
//           .delete(`/albums/${albumIdOfUser002}`)
//           .set({authorization: `Bearer ${tokenUser002}`})
//           .expect(200);
//   })
// })
