import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import {
  SIGN_UP_URL,
  CUST_TEST_NAME,
  CUST_TEST_EMAIL,
  CUST_TEST_PASSWORD,
  CUSTOMER_ROLE,
  ADMIN_TEST_NAME,
  ADMIN_TEST_EMAIL,
  ADMIN_TEST_PASSWORD,
  ADMIN_ROLE,
  ROLES_URL,
  CUSTOMER_DISPLAY,
  ADMIN_DISPLAY,
} from '@orbitelco/common';

// Re-usable signup function for a test customer
export const signupCustomer: any = async () => {
  const res = await request(app)
    .post(SIGN_UP_URL)
    .send({
      name: CUST_TEST_NAME,
      email: CUST_TEST_EMAIL,
      password: CUST_TEST_PASSWORD,
      role: CUSTOMER_ROLE,
    })
    .expect(201);
  return res;
};

// Re-usable signup function for a second test customer
export const signupCustomer2: any = async () => {
  const res = await request(app)
    .post(SIGN_UP_URL)
    .send({
      name: 'Another Customer',
      email: 'another.customer@test.com',
      password: CUST_TEST_PASSWORD,
      role: CUSTOMER_ROLE,
    })
    .expect(201);
  return res;
};

// Re-usable signup function for an admin account
export const signupAdmin: any = async () => {
  const res = await request(app)
    .post(SIGN_UP_URL)
    .send({
      name: ADMIN_TEST_NAME,
      email: ADMIN_TEST_EMAIL,
      password: ADMIN_TEST_PASSWORD,
      role: ADMIN_ROLE,
    })
    .expect(201);
  return res;
};

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

// Re-usable function to create customer role
export const createCustomerRole: any = async () => {
  const res = await request(app)
    .post(ROLES_URL)
    .set('Cookie', fakeSignupAdmin())
    .send({
      role: CUSTOMER_ROLE,
      roleDisplay: CUSTOMER_DISPLAY,
    })
    .expect(201);
  return res;
};

// Re-usable function to create admin role
export const createAdminRole: any = async () => {
  const res = await request(app)
    .post(ROLES_URL)
    .set('Cookie', fakeSignupAdmin())
    .send({
      role: ADMIN_ROLE,
      roleDisplay: ADMIN_DISPLAY,
    })
    .expect(201);
  return res;
};
