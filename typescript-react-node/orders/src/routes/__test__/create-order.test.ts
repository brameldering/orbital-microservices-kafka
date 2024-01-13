import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {
  fakeSignupCustomer,
  testShippingAddress,
} from '../../test/helper-functions';
import {
  ORDERS_URL,
  Order,
  IOrderItem,
  PAYMENT_METHOD_PAYPAL,
} from '@orbital_app/common';

describe('Test create order', () => {
  it('creates an order with valid inputs and returns a status 201 with the created order', async () => {
    // Check that the Order database contains no records
    const ordersBefore = await Order.find({});
    expect(ordersBefore.length).toEqual(0);
    // create test order items
    const orderItems: IOrderItem[] = [
      {
        productId: new mongoose.Types.ObjectId().toHexString(),
        productName: 'Test Product',
        imageURL: 'Test URL',
        price: 40,
        qty: 2,
      },
    ];

    const res = await request(app)
      .post(ORDERS_URL)
      .set('Cookie', fakeSignupCustomer())
      .send({
        orderItems,
        shippingAddress: testShippingAddress,
        paymentMethod: PAYMENT_METHOD_PAYPAL,
      });
    expect(res.status).toEqual(201);
    expect(res.body.totalAmounts.totalPrice).toEqual(101.3);

    // Check that the Product database contains one record
    const ordersAfter = await Order.find({});
    expect(ordersAfter.length).toEqual(1);
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    await request(app).post(ORDERS_URL).send({}).expect(401);
  });
});
