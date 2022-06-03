export const data_test = {
    users: [
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
      },],
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