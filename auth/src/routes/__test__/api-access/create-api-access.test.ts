import request from 'supertest';
import { app } from '../../../app';
import {
  fakeSignupAdmin,
  fakeSignupCustomer,
  TEST_API_NAME,
} from '../../../test/helper-functions';
import {
  API_ACCESS_URL,
  ApiAccess,
  MICROSERVICE_AUTH,
  ADMIN_ROLE,
} from '@orbitelco/common';

describe('Test create api access', () => {
  it('creates an api access with valid inputs and returns a status 201 with the created product', async () => {
    // Check that the ApiAccess database contains no records
    let apiAccessRecords = await ApiAccess.find({});
    expect(apiAccessRecords.length).toEqual(0);

    const res = await request(app)
      .post(API_ACCESS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({
        microservice: MICROSERVICE_AUTH,
        apiName: TEST_API_NAME,
        allowedRoles: [ADMIN_ROLE],
      });
    expect(res.status).toEqual(201);
    expect(res.body.microservice).toEqual(MICROSERVICE_AUTH);
    expect(res.body.apiName).toEqual(TEST_API_NAME);
    expect(res.body.allowedRoles[0]).toEqual(ADMIN_ROLE);

    // Check that the ApiAccess database contains one record
    apiAccessRecords = await ApiAccess.find({});
    expect(apiAccessRecords.length).toEqual(1);
    expect(apiAccessRecords[0].microservice).toEqual(MICROSERVICE_AUTH);
    expect(apiAccessRecords[0].apiName).toEqual(TEST_API_NAME);
    expect(apiAccessRecords[0].allowedRoles[0]).toEqual(ADMIN_ROLE);
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    await request(app)
      .post(API_ACCESS_URL)
      .send({
        microservice: MICROSERVICE_AUTH,
        apiName: TEST_API_NAME,
        allowedRoles: [ADMIN_ROLE],
      })
      .expect(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer api access', async () => {
    await request(app)
      .post(API_ACCESS_URL)
      .set('Cookie', fakeSignupCustomer())
      .send({
        microservice: MICROSERVICE_AUTH,
        apiName: TEST_API_NAME,
        allowedRoles: [ADMIN_ROLE],
      })
      .expect(401);
  });
  it('gives an 422 if 2 apiAccessRecords are created with the same apiName', async () => {
    await request(app)
      .post(API_ACCESS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({
        microservice: MICROSERVICE_AUTH,
        apiName: TEST_API_NAME,
        allowedRoles: [ADMIN_ROLE],
      })
      .expect(201);
    await request(app)
      .post(API_ACCESS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({
        microservice: MICROSERVICE_AUTH,
        apiName: TEST_API_NAME,
        allowedRoles: [ADMIN_ROLE],
      })
      .expect(422);
  });
  // it('returns an error if an invalid api access is provided', async () => {});
  // it('returns an error if an invalid microservice is provided', async () => {});
});
