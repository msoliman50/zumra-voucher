import request from 'supertest';
import { Server } from 'http';

import Voucher from '../../src/api/resources/vouchers/vouchers.model';
import User from '../../src/api/resources/users/users.model';
import Order from '../../src/api/resources/orders/orders.model';
import { mongoose } from '../../src/config/database';
import Application from '../../src/app';

const app = new Application();
let server: Server;

beforeAll(async () => {
  server = await app.bootstrap();
});

beforeEach(async () => {
  await Order.deleteMany({});
  await User.deleteMany({});
  await Voucher.deleteMany({});
});

afterAll(async () => {
  await Order.deleteMany({});
  await User.deleteMany({});
  await Voucher.deleteMany({});
  await mongoose.disconnect();
  await server.close();
});

describe('Vouchers', () => {
  describe('GET /vouchers', () => {
    test('it should return 200 Success', async () => {
      await Voucher.create({ type: 'fixed', value: 10 });
      await Voucher.create({ type: 'percentage', value: 50 });
      const response = await request(server).get('/api/vouchers');
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch('vouchers retrieved successfully');
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toMatchObject({ type: 'fixed', value: 10 });
      expect(response.body.data[1]).toMatchObject({
        type: 'percentage',
        value: 50
      });
    });
  });

  describe('GET /vouchers/:id', () => {
    test('it should return 404 NotFound if voucher does not exist', async () => {
      const id = new mongoose.Types.ObjectId();
      const response = await request(server).get(`/api/vouchers/${id}`);
      expect(response.status).toBe(404);
      expect(response.body.errorType).toMatch('NotFoundError');
      expect(response.body.message).toMatch(`voucher[id=${id}] does not exist`);
    });

    test('it should return 400 BadRequest if voucher id is not valid', async () => {
      const response = await request(server).get(`/api/vouchers/3`);
      expect(response.status).toBe(400);
      expect(response.body.errorType).toMatch('BadRequestError');
      expect(response.body.message).toMatch('invalid voucher id');
    });

    test('it should return 200 Success', async () => {
      const voucher = await Voucher.create({ type: 'fixed', value: 10 });
      const response = await request(server).get(
        `/api/vouchers/${voucher._id}`
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch('voucher retrieved successfully');
      expect(response.body.data.voucher).toMatchObject({
        type: 'fixed',
        value: 10
      });
    });
  });

  describe('POST /vouchers', () => {
    test('it should return 400 BadRequest if voucher percentage is more than 100%', async () => {
      const response = await request(server).post(`/api/vouchers`).send({
        type: 'percentage',
        value: 120
      });
      expect(response.status).toBe(400);
      expect(response.body.errorType).toMatch('BadRequestError');
      expect(response.body.message).toMatch(
        `body: "value" must be less than or equal to 100`
      );
    });

    test('it should return 201 Created', async () => {
      const response = await request(server).post('/api/vouchers').send({
        type: 'fixed',
        value: 20
      });
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch('voucher created successfully');
      expect(response.body.data.voucher).toMatchObject({
        type: 'fixed',
        value: 20
      });
    });
  });

  describe('PUT /vouchers/:id', () => {
    test('it should return 404 NotFound if voucher does not exist', async () => {
      const id = new mongoose.Types.ObjectId();
      const response = await request(server)
        .put(`/api/vouchers/${id}`)
        .send({ value: 40 });
      expect(response.status).toBe(404);
      expect(response.body.errorType).toMatch('NotFoundError');
      expect(response.body.message).toMatch(`voucher[id=${id}] does not exist`);
    });

    test('it should return 405 MethodNotAllowed if voucher is used', async () => {
      const voucher = await Voucher.create({ type: 'fixed', value: 10 });
      const user = await User.create({ name: 'Mahmoud' });
      const order = await Order.create({
        user: user._id,
        voucher: voucher._id
      });

      voucher.usedBy = user._id;
      voucher.usedOn = order._id;
      await voucher.save();

      const response = await request(server)
        .put(`/api/vouchers/${voucher._id}`)
        .send({ value: 40 });
      expect(response.status).toBe(405);
      expect(response.body.errorType).toMatch('MethodNotAllowedError');
      expect(response.body.message).toMatch(
        'updating used voucher is not allowed'
      );
    });

    test('it should return 200 Success', async () => {
      const voucher = await Voucher.create({ type: 'fixed', value: 10 });
      const response = await request(server)
        .put(`/api/vouchers/${voucher._id}`)
        .send({ value: 40 });
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch('voucher updated successfully');
      expect(response.body.data.voucher).toMatchObject({
        type: 'fixed',
        value: 40
      });
    });
  });

  describe('DELETE /vouchers/:id', () => {
    test('it should return 404 NotFound if voucher does not exist', async () => {
      const id = new mongoose.Types.ObjectId();
      const response = await request(server).delete(`/api/vouchers/${id}`);
      expect(response.status).toBe(404);
      expect(response.body.errorType).toMatch('NotFoundError');
      expect(response.body.message).toMatch(`voucher[id=${id}] does not exist`);
    });

    test('it should return 405 MethodNotAllowed if voucher is used', async () => {
      const voucher = await Voucher.create({ type: 'fixed', value: 10 });
      const user = await User.create({ name: 'Mahmoud' });
      const order = await Order.create({
        user: user._id,
        voucher: voucher._id
      });

      voucher.usedBy = user._id;
      voucher.usedOn = order._id;
      await voucher.save();

      const response = await request(server).delete(
        `/api/vouchers/${voucher._id}`
      );
      expect(response.status).toBe(405);
      expect(response.body.errorType).toMatch('MethodNotAllowedError');
      expect(response.body.message).toMatch(
        'deleting used voucher is not allowed'
      );
    });

    test('it should return 200 Success', async () => {
      const voucher = await Voucher.create({ type: 'fixed', value: 10 });
      const response = await request(server).delete(
        `/api/vouchers/${voucher._id}`
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch('voucher deleted successfully');
    });
  });
});
