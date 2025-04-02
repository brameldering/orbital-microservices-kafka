import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { app } from '../app';
import { PRODUCTS_URL } from '../constants/url-constants';
import {
  CUST_TEST_NAME,
  CUST_TEST_EMAIL,
  ADMIN_TEST_NAME,
  ADMIN_TEST_EMAIL,
} from '../constants/test-constants';
import { CUSTOMER_ROLE, ADMIN_ROLE } from '../constants/role-constants';

interface IPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

const payloadTestCustomer: IPayload = {
  id: new mongoose.Types.ObjectId().toHexString(), // Dummy but valid mongodb objectId
  name: CUST_TEST_NAME,
  email: CUST_TEST_EMAIL,
  role: CUSTOMER_ROLE,
};

const payloadTestAdmin: IPayload = {
  id: new mongoose.Types.ObjectId().toHexString(), // Dummy but valid mongodb objectId
  name: ADMIN_TEST_NAME,
  email: ADMIN_TEST_EMAIL,
  role: ADMIN_ROLE,
};

// Function to fake login of a test customer
const fakeSignup = (payload: IPayload): string => {
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  // Turn that session into JSON
  const sessionJSON = JSON.stringify({
    jwt: token,
  });
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return a string that represents the cookie with the encoded data
  return `session=${base64}`;
};

export const fakeSignupCustomer = (): string => {
  return fakeSignup(payloadTestCustomer);
};

// Function to fake login of a test admin user
export const fakeSignupAdmin = (): string => {
  return fakeSignup(payloadTestAdmin);
};

// Create Test Product
export const createTestProduct = async () => {
  const res = await request(app)
    .post(PRODUCTS_URL)
    .set('Cookie', fakeSignupAdmin())
    .send({})
    .expect(201);
  return res;
};
