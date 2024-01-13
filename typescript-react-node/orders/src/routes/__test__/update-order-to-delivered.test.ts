import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {
  createTestOrder,
  fakeSignupCustomer,
  fakeSignupAdmin,
} from '../../test/helper-functions';
import { UPDATE_ORDER_TO_DELIVERED_URL } from '@orbital_app/common';

describe('Test update order to delivered', () => {
  it('returns a status 200 and the order status set to delivered', async () => {
    // create two test orders
    const testOrder1 = await createTestOrder();
    await createTestOrder();

    const res = await request(app)
      .put(UPDATE_ORDER_TO_DELIVERED_URL + '/' + testOrder1.body.id)
      .set('Cookie', fakeSignupAdmin())
      .send({})
      .expect(200);
    // Check that response contains 1 record
    const result = res.body;
    // console.log('orders', result);
    expect(result.totalAmounts.totalPrice).toEqual(101.3);
    expect(result.isDelivered).toEqual(true);
  });
  it('gives an authorization error (401) if not logged in', async () => {
    const testOrder1 = await createTestOrder();

    await request(app)
      .put(UPDATE_ORDER_TO_DELIVERED_URL + '/' + testOrder1.body.id)
      .send({})
      .expect(401);
  });
  it('gives an authorization error (401) if logged in as a customer', async () => {
    const testOrder1 = await createTestOrder();

    await request(app)
      .put(UPDATE_ORDER_TO_DELIVERED_URL + '/' + testOrder1.body.id)
      .set('Cookie', fakeSignupCustomer())
      .send({})
      .expect(401);
  });
  it('gives a not-found error (404) if order not found', async () => {
    await createTestOrder();

    await request(app)
      .put(
        UPDATE_ORDER_TO_DELIVERED_URL +
          '/' +
          new mongoose.Types.ObjectId().toHexString()
      )
      .set('Cookie', fakeSignupAdmin())
      .send({})
      .expect(404);
  });
});
