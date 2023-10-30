import request from 'supertest';
import { app } from '../../app';
import { Product } from '../../productModel';
import { signupAdmin } from '../../test/helper-functions';

describe('Test create product', () => {
  it('has a router listening to /api/products/v2 for post requests', async () => {
    const response = await request(app).post('/api/products/v2').send({});
    expect(response.status).not.toEqual(404);
  });
  it('gives an authorization error if the user is not logged in', async () => {
    const response = await request(app).post('/api/products/v2').send({});

    expect(response.status).toEqual(401);
  });
  it('can only be accessed if the user is signed in as admin role', async () => {
    const response = await request(app)
      .post('/api/products/v2')
      .set('Cookie', signupAdmin())
      .send({});

    expect(response.status).toEqual(201);
  });
  // it('returns an error if an invalid product name is provided', async () => {});
  // it('returns an error if an invalid product price is provided', async () => {});
  it('creates a product with valid inputs', async () => {
    // Check that the Product database contains no records
    let products = await Product.find({});
    expect(products.length).toEqual(0);

    const response = await request(app)
      .post('/api/products/v2')
      .set('Cookie', signupAdmin())
      .send({});

    // console.log('Create product response.body', response.body);
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('Sample name');

    // Check that the Product database contains one record
    products = await Product.find({});
    expect(products.length).toEqual(1);
    expect(products[0].name).toEqual('Sample name');
  });
});
