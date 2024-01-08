import request from 'supertest';
import { app } from '../../app';
import {
  fakeSignupAdmin,
  fakeSignupCustomer,
} from '../../test/helper-functions';
import { UPLOAD_URL } from '@orbitelco/common';

describe('Test file upload', () => {
  it('returns a status 415 and FileUploadError when there is no file to upload', async () => {
    const res = await request(app)
      .post(UPLOAD_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({});
    expect(res.status).toEqual(415);
    expect(res.text).toContain('Image NOT uploaded');
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    await request(app).post(UPLOAD_URL).send({}).expect(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer role', async () => {
    await request(app)
      .post(UPLOAD_URL)
      .set('Cookie', fakeSignupCustomer())
      .send({})
      .expect(401);
  });
});
