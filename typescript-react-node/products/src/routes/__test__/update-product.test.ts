import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {
  fakeSignupAdmin,
  fakeSignupCustomer,
  createTestProduct,
} from '../../test/helper-functions';
import { PRODUCTS_URL } from '@orbital_app/common';

describe('Test update product', () => {
  it('returns a status 200 and the product info for the updated product', async () => {
    // create product
    const res = await createTestProduct();
    const id = res.body.id;

    // update newly created product
    const updProduct = await request(app)
      .put(PRODUCTS_URL + '/' + id)
      .set('Cookie', fakeSignupAdmin())
      .send({
        name: 'Updated Product',
        price: 10,
        description: 'Updated Description',
        imageURL: 'Updated ImageURL',
        brand: 'Updated Brand',
        category: 'Updated Category',
        countInStock: 5,
      });
    expect(updProduct.status).toEqual(200);
    expect(updProduct.body.name).toEqual('Updated Product');

    // Fetch product and chack it has also been updated in database
    const updatedProduct = await request(app)
      .get(PRODUCTS_URL + '/' + id)
      .send();
    expect(updatedProduct.status).toEqual(200);
    expect(updatedProduct.body.name).toEqual('Updated Product');
  });
  it('returns a status 400 when trying to update a product with an invalid object Id', async () => {
    const dummyProductId = 'invalid_object_id';
    // try to update product with invalid object id
    const updatedProduct = await request(app)
      .put(PRODUCTS_URL + '/' + dummyProductId)
      .set('Cookie', fakeSignupAdmin())
      .send({
        name: 'Updated Product',
        price: 10,
        description: 'Updated Description',
        imageURL: 'Updated ImageURL',
        brand: 'Updated Brand',
        category: 'Updated Category',
        countInStock: 5,
      });
    expect(updatedProduct.status).toEqual(400);
    // Check that error message contains message "('Invalid ObjectId:')"
    expect(updatedProduct.text).toContain(
      'Invalid ObjectId: ' + dummyProductId
    );
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    // create product
    const res = await createTestProduct();
    const id = res.body.id;

    // try to update newly created product
    await request(app)
      .put(PRODUCTS_URL + '/' + id)
      .send({
        name: 'Updated Product',
        price: 10,
        description: 'Updated Description',
        imageURL: 'Updated ImageURL',
        brand: 'Updated Brand',
        category: 'Updated Category',
        countInStock: 5,
      })
      .expect(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer role', async () => {
    // create product
    const res = await createTestProduct();
    const id = res.body.id;

    //  try to update newly created product
    await request(app)
      .put(PRODUCTS_URL + '/' + id)
      .set('Cookie', fakeSignupCustomer())
      .send({
        name: 'Updated Product',
        price: 10,
        description: 'Updated Description',
        imageURL: 'Updated ImageURL',
        brand: 'Updated Brand',
        category: 'Updated Category',
        countInStock: 5,
      })
      .expect(401);
  });
  it('returns a status 404 if a product is not found', async () => {
    const dummyProductId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    // try to update non-existing product
    const res = await request(app)
      .put(PRODUCTS_URL + '/' + dummyProductId)
      .set('Cookie', fakeSignupAdmin())
      .send({
        name: 'Updated Product',
        price: 10,
        description: 'Updated Description',
        imageURL: 'Updated ImageURL',
        brand: 'Updated Brand',
        category: 'Updated Category',
        countInStock: 5,
      });
    expect(res.status).toEqual(404);
    // Check that error message contains message "('Product not found')"
    expect(res.text).toContain('Product not found');
  });
});
