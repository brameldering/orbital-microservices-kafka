import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../productModel';
import {
  fakeSignupAdmin,
  fakeSignupCustomer,
} from '../../test/helper-functions';
import { PRODUCTS_URL } from '@orbitelco/common';

describe('Test create product', () => {
  it('creates a product with valid inputs and returns a status 201 with the created product', async () => {
    // Check that the Product database contains no records
    let products = await Product.find({});
    expect(products.length).toEqual(0);

    const res = await request(app)
      .post(PRODUCTS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({});
    expect(res.status).toEqual(201);
    expect(res.body.name).toEqual('Sample name');

    // Check that the Product database contains one record
    products = await Product.find({});
    expect(products.length).toEqual(1);
    expect(products[0].name).toEqual('Sample name');
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    await request(app).post(PRODUCTS_URL).send({}).expect(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer role', async () => {
    await request(app)
      .post(PRODUCTS_URL)
      .set('Cookie', fakeSignupCustomer())
      .send({})
      .expect(401);
  });
  // it('returns an error if an invalid product name is provided', async () => {});
  // it('returns an error if an invalid product price is provided', async () => {});
});
