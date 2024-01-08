import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
  CUST_TEST_NAME,
  CUST_TEST_EMAIL,
  CUSTOMER_ROLE,
  ADMIN_TEST_NAME,
  ADMIN_TEST_EMAIL,
  ADMIN_ROLE,
  IShippingAddress,
  ORDERS_URL,
  PAYMENT_METHOD_PAYPAL,
  IOrderItem,
} from '@orbitelco/common';
import { app } from '../app';

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

export const testShippingAddress: IShippingAddress = {
  address: 'Test Street 1',
  postalCode: '1111 AA',
  city: 'Test City',
  country: 'Test Country',
};

// Create Test Order
export const createTestOrder = async () => {
  const orderItems: IOrderItem[] = [
    {
      productId: new mongoose.Types.ObjectId().toHexString(),
      productName: 'Test Product',
      imageURL: 'Test URL',
      price: 40,
      qty: 2,
    },
  ];
  const res = await request(app)
    .post(ORDERS_URL)
    .set('Cookie', fakeSignupCustomer())
    .send({
      orderItems,
      shippingAddress: testShippingAddress,
      paymentMethod: PAYMENT_METHOD_PAYPAL,
    })
    .expect(201);
  return res;
};
