import request from 'supertest';
import { Server } from 'http';

import Order from '../../src/api/resources/orders/orders.model';
import User from '../../src/api/resources/users/users.model';
import Voucher from '../../src/api/resources/vouchers/vouchers.model';
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

describe('Orders', () => {
  describe('GET /orders', () => {
    test('it should return 200 Success', async () => {
      const user = await User.create({ name: 'Mahmoud' });
      const order1 = await Order.create({ user: user._id });
      const order2 = await Order.create({ user: user._id });
      const response = await request(server).get('/api/orders');
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch('orders retrieved successfully');
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toMatchObject({ _id: order1._id });
      expect(response.body.data[0].user).toMatchObject({ name: 'Mahmoud' });
      expect(response.body.data[1]).toMatchObject({
        _id: order2._id
      });
      expect(response.body.data[1].user).toMatchObject({ name: 'Mahmoud' });
    });
  });

  describe('GET /orders/:id', () => {
    test('it should return 404 NotFound if order does not exist', async () => {
      const id = new mongoose.Types.ObjectId();
      const response = await request(server).get(`/api/orders/${id}`);
      expect(response.status).toBe(404);
      expect(response.body.errorType).toMatch('NotFoundError');
      expect(response.body.message).toMatch(`order[id=${id}] does not exist`);
    });

    test('it should return 400 BadRequest if order id is not valid', async () => {
      const response = await request(server).get(`/api/orders/3`);
      expect(response.status).toBe(400);
      expect(response.body.errorType).toMatch('BadRequestError');
      expect(response.body.message).toMatch('invalid order id');
    });

    test('it should return 200 Success', async () => {
      const user = await User.create({ name: 'Khaled' });
      const order = await Order.create({ user: user._id });
      const response = await request(server).get(`/api/orders/${order._id}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch('order retrieved successfully');
      expect(response.body.data.order).toMatchObject({
        _id: order._id
      });
      expect(response.body.data.order.user).toMatchObject({
        name: 'Khaled'
      });
    });
  });

  describe('POST /users', () => {
    test('it should return 400 BadRequest if the userId is missing', async () => {
      const response = await request(server).post('/api/orders');
      expect(response.status).toBe(400);
      expect(response.body.errorType).toMatch('BadRequestError');
      expect(response.body.message).toMatch('body: "userId" is required');
    });

    test('it should return 404 NotFound if the user does not exist', async () => {
      const userId = new mongoose.Types.ObjectId();
      const response = await request(server)
        .post('/api/orders')
        .send({ userId });
      expect(response.status).toBe(404);
      expect(response.body.errorType).toMatch('NotFoundError');
      expect(response.body.message).toMatch(
        `user[id=${userId}] does not exist`
      );
    });

    test('it should return 404 NotFound if the user does not exist', async () => {
      const user = await User.create({ name: 'Mahmoud' });
      const voucherId = new mongoose.Types.ObjectId();
      const response = await request(server)
        .post('/api/orders')
        .send({ userId: user._id, voucherId });
      expect(response.status).toBe(404);
      expect(response.body.errorType).toMatch('NotFoundError');
      expect(response.body.message).toMatch(
        `voucher[id=${voucherId}] does not exist`
      );
    });

    test('it should return 405 MethodNotAllowed if the voucher is used', async () => {
      const user = await User.create({ name: 'Mahmoud' });
      const voucher = await Voucher.create({ type: 'fixed', value: 70 });

      // use the voucher
      const responseSuccess = await request(server).post('/api/orders').send({
        userId: user._id,
        voucherId: voucher._id
      });
      expect(responseSuccess.status).toBe(201);

      // test creating new order with the same voucher
      const responseFail = await request(server)
        .post('/api/orders')
        .send({ userId: user._id, voucherId: voucher._id });
      expect(responseFail.status).toBe(405);
      expect(responseFail.body.errorType).toMatch('MethodNotAllowedError');
      expect(responseFail.body.message).toMatch(
        `voucher[id=${voucher._id}] is already used`
      );
    });

    test('it should return 201 Created', async () => {
      const user = await User.create({ name: 'Mahmoud' });
      const voucher = await Voucher.create({ type: 'fixed', value: 70 });

      const response = await request(server).post('/api/orders').send({
        userId: user._id,
        voucherId: voucher._id
      });
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch('order created successfully');
      expect(response.body.data.order.user).toMatch(user._id.toString());
      expect(response.body.data.order.voucher).toMatch(voucher._id.toString());
    });
  });
});
