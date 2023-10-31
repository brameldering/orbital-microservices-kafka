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

    const response = await request(app)
      .post(PRODUCTS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({});
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('Sample name');

    // Check that the Product database contains one record
    products = await Product.find({});
    expect(products.length).toEqual(1);
    expect(products[0].name).toEqual('Sample name');
  });
  it('can only be accessed if the user is signed in as admin role', async () => {
    const response = await request(app)
      .post(PRODUCTS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({});
    expect(response.status).toEqual(201);
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    const response = await request(app).post(PRODUCTS_URL).send({});
    expect(response.status).toEqual(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer role', async () => {
    const response = await request(app)
      .post(PRODUCTS_URL)
      .set('Cookie', fakeSignupCustomer())
      .send({});
    expect(response.status).toEqual(401);
  });
  // it('returns an error if an invalid product name is provided', async () => {});
  // it('returns an error if an invalid product price is provided', async () => {});
});
