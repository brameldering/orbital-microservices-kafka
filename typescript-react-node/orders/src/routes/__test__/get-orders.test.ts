import request from 'supertest';
import { app } from '../../app';
import {
  fakeSignupAdmin,
  createTestOrder,
  fakeSignupCustomer,
} from '../../test/helper-functions';
import { ORDERS_URL } from '@orbital_app/common';

describe('Test get orders', () => {
  it('returns a status 200 and the order info for 1 order', async () => {
    // create test order
    await createTestOrder();

    const res = await request(app)
      .get(ORDERS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({})
      .expect(200);
    // Check that response contains 1 record
    const result = res.body;
    // console.log('orders', result);
    expect(result.length).toEqual(1);
    expect(result[0].totalAmounts.totalPrice).toEqual(101.3);
  });
  it('returns a status 200 and the order info for 3 orders', async () => {
    // create test order
    await createTestOrder();
    await createTestOrder();
    await createTestOrder();

    const res = await request(app)
      .get(ORDERS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({})
      .expect(200);
    // Check that response contains 1 record
    const result = res.body;
    // console.log('orders', result);
    expect(result.length).toEqual(3);
    expect(result[0].totalAmounts.totalPrice).toEqual(101.3);
    expect(result[1].totalAmounts.totalPrice).toEqual(101.3);
  });
  it('gives an authorization error (401) if the user is not logged in as admin but as a customer', async () => {
    await createTestOrder();

    await request(app)
      .get(ORDERS_URL)
      .set('Cookie', fakeSignupCustomer())
      .send({})
      .expect(401);
  });
  it('gives an authorization error (401) if the user is not logged in at all', async () => {
    await createTestOrder();

    await request(app).get(ORDERS_URL).send({}).expect(401);
  });
});
