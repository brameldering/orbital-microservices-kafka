import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {
  createTestOrder,
  fakeSignupCustomer,
} from '../../test/helper-functions';
import { ORDERS_URL } from '@orbitelco/common';

describe('Test get order by id', () => {
  it('returns a status 200 and the order info for 1 order', async () => {
    // create two test orders
    const testOrder1 = await createTestOrder();
    await createTestOrder();

    const res = await request(app)
      .get(ORDERS_URL + '/' + testOrder1.body.id)
      .set('Cookie', fakeSignupCustomer())
      .send({})
      .expect(200);
    // Check that response contains 1 record
    const result = res.body;
    // console.log('orders', result);
    expect(result.totalAmounts.totalPrice).toEqual(101.3);
  });
  it('gives an authorization error (401) if not logged in', async () => {
    const testOrder1 = await createTestOrder();

    await request(app)
      .get(ORDERS_URL + '/' + testOrder1.body.id)
      .send({})
      .expect(401);
  });
  it('gives a not-found error (404) if order not found', async () => {
    await createTestOrder();

    await request(app)
      .get(ORDERS_URL + '/' + new mongoose.Types.ObjectId().toHexString())
      .set('Cookie', fakeSignupCustomer())
      .send({})
      .expect(404);
  });
});
