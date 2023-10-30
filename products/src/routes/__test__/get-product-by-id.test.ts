import request from 'supertest';
import { app } from '../../app';
import { signupAdmin } from '../../test/helper-functions';
import mongoose from 'mongoose';

describe('Test get product by id', () => {
  it('returns a 404 if a product is not found', async () => {
    const dummyProductId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    await request(app)
      .get('/api/products/v2/' + dummyProductId)
      .send()
      .expect(404);
  });
  it('returns the product if product is found', async () => {
    // create product
    const res = await request(app)
      .post('/api/products/v2')
      .set('Cookie', signupAdmin())
      .send({});

    const id = res.body.id;

    const resProduct = await request(app)
      .get(`/api/products/v2/${id}`)
      .send()
      .expect(200);

    expect(resProduct.body.name).toEqual('Sample name');
  });
});
