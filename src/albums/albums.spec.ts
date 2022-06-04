import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { data_test } from '../configs/data_test';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { LoginDto } from '../users/dto/login.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { InviteToAlbum } from './dto/invite-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
describe(`AlbumController (e2e)`, () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  let tokenUser002: string;
  let tokenUser003: string;
  let albumIdOfUser002: string;
  let inviteToken: string;
  let albumUser002: Object[];
  let token: string;
  //register
  it('[POST /users/register] Success: Created', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send(data_test.albumTestData.albumUser002 as CreateUserDto)
      .expect(201);
    token = response.body.data.tokenConfirmation;
  });
  //confirm
  it('[GET /users/register/:token] Success: Register', async () => {
    await request(app.getHttpServer())
      .get('/users/register/' + token)
      .expect(200);
  });
  //register
  it('[POST /users/register] Success: Created', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send(data_test.albumTestData.albumUser003 as CreateUserDto)
      .expect(201);
    token = response.body.data.tokenConfirmation;
  });
  //confirm
  it('[GET /users/register/:token] Success: Register', async () => {
    await request(app.getHttpServer())
      .get('/users/register/' + token)
      .expect(200);
  });

  //login account
  it('[POST /users/login]', async () => {
    const rs = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: data_test.albumTestData.albumUser002.email,
        password: data_test.albumTestData.albumUser002.password,
      } as LoginDto)
      .expect(200);
    tokenUser002 = rs.body.data.accessToken;
  });
  it('[POST /users/login]', async () => {
    const rs = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: data_test.albumTestData.albumUser003.email,
        password: data_test.albumTestData.albumUser003.password,
      } as LoginDto)
      .expect(200);
    tokenUser003 = rs.body.data.accessToken;
  });
  it('[POST /albums] Success: Create Album', async () => {
    const rs = await request(app.getHttpServer())
      .post('/albums')
      .set({ authorization: `Bearer ${tokenUser002}` })
      .send(data_test.albumTestData.successCreateAlbum1 as CreateAlbumDto)
      .expect(200);
    albumIdOfUser002 = rs.body.data.id;
  });
  it('[POST /albums/inviteToAlbum] Success: Invite Become Contributor', async () => {
    const rs = await request(app.getHttpServer())
      .post('/albums/inviteToAlbum')
      .set({ authorization: `Bearer ${tokenUser002}` })
      .send({
        username: data_test.albumTestData.albumUser003.username,
        albumId: albumIdOfUser002,
      } as InviteToAlbum)
      .expect(200);
    inviteToken = rs.body.data.inviteToken;
  });
  it('[POST /albums/inviteToAlbum] Fail: Invalid Username', async () => {
    await request(app.getHttpServer())
      .post('/albums/inviteToAlbum')
      .set({ authorization: `Bearer ${tokenUser002}` })
      .send({
        username: 'wrongUsername',
        albumId: albumIdOfUser002,
      } as InviteToAlbum)
      .expect(404);
  });
  it('[POST /albums/inviteToAlbum] Fail: Invalid AlbumId', async () => {
    await request(app.getHttpServer())
      .post('/albums/inviteToAlbum')
      .set({ authorization: `Bearer ${tokenUser002}` })
      .send({
        username: 'user003',
        albumId: `${albumIdOfUser002.slice(0, albumIdOfUser002.length - 1)}n`,
      } as InviteToAlbum)
      .expect(404);
  });
  it('[GET /albums/handleInviation/:token] Success: Invite Become Contributor', async () => {
    await request(app.getHttpServer())
      .get(`/albums/handleInviation/${inviteToken}`)
      .expect(200);
  });
  it(`[GET /albums] Success: Get All User's Album`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/albums`)
      .set({ authorization: `Bearer ${tokenUser002}` })
      .expect(200);
    albumUser002 = res.body.data;
  });
  it(`[GET /albums/allAlbumJoined] Success: Get All User's Album`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/albums/allAlbumJoined`)
      .set({ authorization: `Bearer ${tokenUser002}` })
      .expect(200);
  });
  it(`[GET /albums/:id] Success: Get All User's Album`, async () => {
    const res = await request(app.getHttpServer())
      .get(`/albums/allAlbumJoined`)
      .set({ authorization: `Bearer ${tokenUser002}` })
      .expect(200);
  });
  it(`[PATCH /albums/:id] Success: Change Infor Album`, async () => {
    const res = await request(app.getHttpServer())
      .patch(`/albums/${albumIdOfUser002}`)
      .set({ authorization: `Bearer ${tokenUser002}` })
      .send(data_test.albumTestData.changedNameAlbum1 as UpdateAlbumDto)
      .expect(200);
  });
  it(`[DELETE /albums/:id] Fail: Delete An Album`, async () => {
    const res = await request(app.getHttpServer())
      .delete(`/albums/${albumIdOfUser002}`)
      .set({ authorization: `Bearer ${tokenUser003}` })
      .expect(401);
  });
  it(`[DELETE /albums/:id] Success: Delete An Album`, async () => {
    const res = await request(app.getHttpServer())
      .delete(`/albums/${albumIdOfUser002}`)
      .set({ authorization: `Bearer ${tokenUser002}` })
      .expect(200);
  });
});
