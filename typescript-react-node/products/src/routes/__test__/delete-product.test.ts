import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {
  fakeSignupAdmin,
  fakeSignupCustomer,
  createTestProduct,
} from '../../test/helper-functions';
import { PRODUCTS_URL } from '@orbitelco/common';

describe('Test delete product', () => {
  it('returns a status 200 after deleting a product and the product is no longer in the DB', async () => {
    // create product
    const res = await createTestProduct();
    const id = res.body.id;

    // delete newly created product
    await request(app)
      .delete(PRODUCTS_URL + '/' + id)
      .set('Cookie', fakeSignupAdmin())
      .send()
      .expect(200);

    // Try to fetch product and chack it returns a 404 Not Found
    const resDelete = await request(app)
      .get(PRODUCTS_URL + '/' + id)
      .send();
    // Check that error message contains message "('Product not found')"
    expect(resDelete.status).toEqual(404);
    expect(resDelete.text).toContain('Product not found');
  });
  it('returns a status 400 when trying to delete a product with an invalid object Id', async () => {
    const dummyProductId = 'invalid_object_id';
    // try to update product with invalid object id
    const res = await request(app)
      .delete(PRODUCTS_URL + '/' + dummyProductId)
      .set('Cookie', fakeSignupAdmin())
      .send();
    // Check that error message contains message "('Invalid ObjectId:')"
    expect(res.status).toEqual(400);
    expect(res.text).toContain('Invalid ObjectId: ' + dummyProductId);
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    // create product
    const res = await createTestProduct();
    const id = res.body.id;

    // try to delete newly created product
    await request(app)
      .delete(PRODUCTS_URL + '/' + id)
      .send()
      .expect(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer role', async () => {
    // create product
    const res = await createTestProduct();
    const id = res.body.id;

    //  try to update newly created product
    await request(app)
      .delete(PRODUCTS_URL + '/' + id)
      .set('Cookie', fakeSignupCustomer())
      .send()
      .expect(401);
  });
  it('returns a status 404 if a product is not found', async () => {
    const dummyProductId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    // try to update non-existing product
    const res = await request(app)
      .delete(PRODUCTS_URL + '/' + dummyProductId)
      .set('Cookie', fakeSignupAdmin())
      .send();
    // Check that error message contains message "('Product not found')"
    expect(res.status).toEqual(404);
    expect(res.text).toContain('Product not found');
  });
});
