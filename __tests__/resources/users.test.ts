import request from 'supertest';
import { Server } from 'http';

import User from '../../src/api/resources/users/users.model';
import { mongoose } from '../../src/config/database';
import Application from '../../src/app';

const app = new Application();
let server: Server;

beforeAll(async () => {
  server = await app.bootstrap();
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  await server.close();
});

describe('Users', () => {
  describe('GET /users', () => {
    test('it should return 200 Success', async () => {
      await User.create({ name: 'Mahmoud' });
      await User.create({ name: 'Ali' });
      const response = await request(server).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch('users retrieved successfully');
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toMatchObject({ name: 'Mahmoud' });
      expect(response.body.data[1]).toMatchObject({
        name: 'Ali'
      });
    });
  });

  describe('GET /users/:id', () => {
    test('it should return 404 NotFound if user does not exist', async () => {
      const id = new mongoose.Types.ObjectId();
      const response = await request(server).get(`/api/users/${id}`);
      expect(response.status).toBe(404);
      expect(response.body.errorType).toMatch('NotFoundError');
      expect(response.body.message).toMatch(`user[id=${id}] does not exist`);
    });

    test('it should return 400 BadRequest if user id is not valid', async () => {
      const response = await request(server).get(`/api/users/3`);
      expect(response.status).toBe(400);
      expect(response.body.errorType).toMatch('BadRequestError');
      expect(response.body.message).toMatch('invalid user id');
    });

    test('it should return 200 Success', async () => {
      const user = await User.create({ name: 'Khaled' });
      const response = await request(server).get(`/api/users/${user._id}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch('user retrieved successfully');
      expect(response.body.data.user).toMatchObject({
        name: 'Khaled'
      });
    });
  });

  describe('POST /users', () => {
    test('it should return 400 BadRequest if the name is missing', async () => {
      const response = await request(server).post('/api/users');
      expect(response.status).toBe(400);
      expect(response.body.errorType).toMatch('BadRequestError');
      expect(response.body.message).toMatch('body: "name" is required');
    });
    test('it should return 201 Created', async () => {
      const response = await request(server)
        .post('/api/users')
        .send({ name: 'Ali' });
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch('user created successfully');
      expect(response.body.data.user).toMatchObject({ name: 'Ali' });
    });
  });
});
