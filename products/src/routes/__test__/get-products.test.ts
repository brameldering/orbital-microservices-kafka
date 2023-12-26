import request from 'supertest';
import { app } from '../../app';
import { createTestProduct } from '../../test/helper-functions';
import { PRODUCTS_URL } from '@orbitelco/common';

describe('Test get products', () => {
  it('returns a status 200 and the product info for 1 product', async () => {
    // create product
    await createTestProduct();

    const res = await request(app).get(PRODUCTS_URL).send({}).expect(200);
    // Check that response contains 1 record
    const result = res.body.products;
    expect(result.length).toEqual(1);
  });
  it('returns a status 200 and the product info for 3 products', async () => {
    // create 2 product
    await createTestProduct();
    await createTestProduct();
    await createTestProduct();

    const res = await request(app).get(PRODUCTS_URL).send({}).expect(200);
    console.log(res);
    // Check that response contains 1 record
    const result = res.body.products;
    expect(result.length).toEqual(3);
  });
  it('returns a status 200 and the product info for 1 product when searching for sample', async () => {
    // create 1 products
    await createTestProduct();

    const res = await request(app)
      .get(PRODUCTS_URL + '?keyword=sample')
      .send({});
    expect(res.status).toEqual(200);
    // Check that response contains 1 record
    const result = res.body.products;
    expect(result.length).toEqual(1);
  });
  it('returns a status 500 when searching using /? instead of ?', async () => {
    // create 1 product
    await createTestProduct();

    const res = await request(app)
      .get(PRODUCTS_URL + '/?keyword=sample')
      .send({});
    expect(res.status).toEqual(500);
    // Check that response contains 1 record
    expect(res.text).toContain('URL should not contain /?, URL:');
  });
  it('returns a status 200 and the product info for 0 products when searching for nomatch', async () => {
    // create 1 product
    await createTestProduct();

    const res = await request(app)
      .get(PRODUCTS_URL + '?keyword=nomatch')
      .send({});
    expect(res.status).toEqual(200);
    // Check that response contains 0 records
    const result = res.body.products;
    expect(result.length).toEqual(0);
  });
});
