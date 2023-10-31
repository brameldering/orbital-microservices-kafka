import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { fakeSignupAdmin } from '../../test/helper-functions';
import { PRODUCTS_URL } from '@orbitelco/common';

describe('Test get product by id', () => {
  it('returns a status 200 and the product info for an existing product', async () => {
    // create product (POST to PRODUCTS_URL)
    const res = await request(app)
      .post(PRODUCTS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({})
      .expect(201);
    const id = res.body.id;

    // get newly created product
    const resProduct = await request(app)
      .get(PRODUCTS_URL + '/' + id)
      .send()
      .expect(200);
    expect(resProduct.body.name).toEqual('Sample name');
  });
  it('returns a status 400 when trying to get a product with an invalid object Id', async () => {
    const dummyProductId = 'invalid_object_id';
    const res = await request(app)
      .get(PRODUCTS_URL + '/' + dummyProductId)
      .send()
      .expect(400);
    // Check that error message contains message "('Invalid ObjectId:')"
    expect(res.text.includes('Invalid ObjectId: ' + dummyProductId)).toEqual(
      true
    );
  });
  it('returns a status 404 if a product is not found', async () => {
    const dummyProductId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    await request(app)
      .get(PRODUCTS_URL + '/' + dummyProductId)
      .send()
      .expect(404);
  });
});
