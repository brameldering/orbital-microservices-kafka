import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import {
  fakeSignupAdmin,
  fakeSignupCustomer,
  createApiAccess,
  TEST_API_NAME,
} from '../../../test/helper-functions';
import {
  API_ACCESS_URL,
  MICROSERVICE_AUTH,
  ANONYMOUS_ROLE,
  CUSTOMER_ROLE,
  ADMIN_ROLE,
} from '@orbitelco/common';

describe('Test update api access', () => {
  it('returns a status 200 for an update of the roles', async () => {
    // create api access
    const res = await createApiAccess();
    const id = res.body.id;
    // update newly created api access
    const updApiAccess = await request(app)
      .put(API_ACCESS_URL + '/' + id)
      .set('Cookie', fakeSignupAdmin())
      .send({
        apiName: TEST_API_NAME,
        microservice: MICROSERVICE_AUTH,
        allowedRoles: [ANONYMOUS_ROLE, CUSTOMER_ROLE, ADMIN_ROLE],
      });
    expect(updApiAccess.status).toEqual(200);
    expect(updApiAccess.body.apiName).toEqual(TEST_API_NAME);
    expect(updApiAccess.body.microservice).toEqual(MICROSERVICE_AUTH);
    expect(updApiAccess.body.allowedRoles).toEqual([
      ANONYMOUS_ROLE,
      CUSTOMER_ROLE,
      ADMIN_ROLE,
    ]);

    // Fetch api access and chack it has also been updated in database
    const updatedApiAccess = await request(app)
      .get(API_ACCESS_URL + '/' + id)
      .set('Cookie', fakeSignupAdmin())
      .send();
    expect(updatedApiAccess.status).toEqual(200);
    expect(updatedApiAccess.body.apiName).toEqual(TEST_API_NAME);
    expect(updatedApiAccess.body.microservice).toEqual(MICROSERVICE_AUTH);
    expect(updatedApiAccess.body.allowedRoles).toEqual([
      ANONYMOUS_ROLE,
      CUSTOMER_ROLE,
      ADMIN_ROLE,
    ]);
  });
  it('returns a status 400 when trying to update a api access with an invalid object Id', async () => {
    const dummyApiAccesstId = 'invalid_object_id';
    // try to update api access with invalid object id
    const updatedApiAccess = await request(app)
      .put(API_ACCESS_URL + '/' + dummyApiAccesstId)
      .set('Cookie', fakeSignupAdmin())
      .send({
        apiName: 'TEST_API_UPDATED',
        microservice: MICROSERVICE_AUTH,
        allowedRoles: [ANONYMOUS_ROLE, CUSTOMER_ROLE, ADMIN_ROLE],
      });
    expect(updatedApiAccess.status).toEqual(400);
    // Check that error message contains message "('Invalid ObjectId:')"
    expect(updatedApiAccess.text).toContain(
      'Invalid ObjectId: ' + dummyApiAccesstId
    );
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    // create api access
    const res = await createApiAccess();
    const id = res.body.id;

    // try to update newly created api access
    await request(app)
      .put(API_ACCESS_URL + '/' + id)
      .send({
        apiName: 'TEST_API_UPDATED',
        microservice: MICROSERVICE_AUTH,
        allowedRoles: [ANONYMOUS_ROLE, CUSTOMER_ROLE, ADMIN_ROLE],
      })
      .expect(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer role', async () => {
    // create api access
    const res = await createApiAccess();
    const id = res.body.id;

    //  try to update newly created api access
    await request(app)
      .put(API_ACCESS_URL + '/' + id)
      .set('Cookie', fakeSignupCustomer())
      .send({
        apiName: 'TEST_API_UPDATED',
        microservice: MICROSERVICE_AUTH,
        allowedRoles: [ANONYMOUS_ROLE, CUSTOMER_ROLE, ADMIN_ROLE],
      })
      .expect(401);
  });
  it('returns a status 404 if an api access is not found', async () => {
    const dummyApiAccesstId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    // try to update non-existing api access
    const res = await request(app)
      .put(API_ACCESS_URL + '/' + dummyApiAccesstId)
      .set('Cookie', fakeSignupAdmin())
      .send({
        apiName: 'TEST_API_UPDATED',
        microservice: MICROSERVICE_AUTH,
        allowedRoles: [ANONYMOUS_ROLE, CUSTOMER_ROLE, ADMIN_ROLE],
      });
    expect(res.status).toEqual(404);
    // Check that error message contains message "('Api Access not found')"
    expect(res.text).toContain('Api Access not found');
  });
});
