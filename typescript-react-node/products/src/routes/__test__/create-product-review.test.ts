import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {
  fakeSignupCustomer,
  createTestProduct,
} from '../../test/helper-functions';
import { PRODUCTS_URL, PRODUCT_REVIEW_URL } from '@orbitelco/common';

describe('Test create product review', () => {
  it('returns a status 201 when a product review has been succesfully created', async () => {
    // create product
    const res = await createTestProduct();
    const id = res.body.id;

    // Create review for product
    await request(app)
      .post(PRODUCT_REVIEW_URL + '/' + id)
      .set('Cookie', fakeSignupCustomer())
      .send({
        rating: 5,
        comment: 'Test Rating',
      })
      .expect(201);

    // Fetch product and chack the rating has also been updated in database
    const reviewedProduct = await request(app)
      .get(PRODUCTS_URL + '/' + id)
      .send();
    expect(reviewedProduct.status).toEqual(200);
    expect(reviewedProduct.body.reviews[0].comment).toEqual('Test Rating');
  });
  it('returns a status 400 when trying to review a product that has already been reviewed by this user', async () => {
    // create product
    const res = await createTestProduct();
    const id = res.body.id;

    // Create review for product
    await request(app)
      .post(PRODUCT_REVIEW_URL + '/' + id)
      .set('Cookie', fakeSignupCustomer())
      .send({
        rating: 5,
        comment: 'Test Rating',
      })
      .expect(201);

    // Create another review for product
    const reviewedProduct = await request(app)
      .post(PRODUCT_REVIEW_URL + '/' + id)
      .set('Cookie', fakeSignupCustomer())
      .send({
        rating: 5,
        comment: 'Test Rating',
      });
    expect(reviewedProduct.status).toEqual(400);
    // Check that error message contains message "You have already reviewed this product"
    expect(reviewedProduct.text).toContain(
      'You have already reviewed this product'
    );
  });
  it('returns a status 400 when trying to create a review for a product with an invalid object Id', async () => {
    const dummyProductId = 'invalid_object_id';
    // try to update product with invalid object id
    const reviewedProduct = await request(app)
      .post(PRODUCT_REVIEW_URL + '/' + dummyProductId)
      .set('Cookie', fakeSignupCustomer())
      .send({
        rating: 5,
        comment: 'Test Rating',
      });
    expect(reviewedProduct.status).toEqual(400);
    // Check that error message contains message "Invalid ObjectId: ""
    expect(reviewedProduct.text).toContain(
      'Invalid ObjectId: ' + dummyProductId
    );
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    // create product
    const res = await createTestProduct();
    const id = res.body.id;

    // try to create review when not logged in
    await request(app)
      .post(PRODUCT_REVIEW_URL + '/' + id)
      .send({
        rating: 5,
        comment: 'Test Rating',
      })
      .expect(401);
  });
  it('returns a status 404 if a product is not found', async () => {
    const dummyProductId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    // try to update non-existing product
    const res = await request(app)
      .post(PRODUCT_REVIEW_URL + '/' + dummyProductId)
      .set('Cookie', fakeSignupCustomer())
      .send({
        rating: 5,
        comment: 'Test Rating',
      });
    expect(res.status).toEqual(404);
    // Check that error message contains message "Product not found"
    expect(res.text).toContain('Product not found');
  });
});
