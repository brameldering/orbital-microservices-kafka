import request from 'supertest';
import { app } from '../../app';
import { createTestProduct } from '../../test/helper-functions';
import { PRODUCTS_URL } from '@orbitelco/common';

describe('Test get products', () => {
  it('returns a status 200 and the product info for 1 product', async () => {
    // create 3 products (POST to PRODUCTS_URL)
    await createTestProduct();

    const res = await request(app).get(PRODUCTS_URL).send({}).expect(200);
    // Check that response contains 3 records
    const result = res.body.products;
    expect(result.length).toEqual(1);
  });
  it('returns a status 200 and the product info for 1 product when searching for sample', async () => {
    // create 3 products (POST to PRODUCTS_URL)
    await createTestProduct();

    const res = await request(app)
      .get(PRODUCTS_URL + '/?keyword=sample')
      .send({});
    expect(res.status).toEqual(200);
    // Check that response contains 3 records
    const result = res.body.products;
    expect(result.length).toEqual(1);
  });
  it('returns a status 200 and the product info for 0 products when searching for nomatch', async () => {
    // create 3 products (POST to PRODUCTS_URL)
    await createTestProduct();

    const res = await request(app)
      .get(PRODUCTS_URL + '/?keyword=nomatch')
      .send({});
    expect(res.status).toEqual(200);
    // Check that response contains 3 records
    const result = res.body.products;
    expect(result.length).toEqual(0);
  });
});
