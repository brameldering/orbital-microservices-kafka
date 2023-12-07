import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { apiAccessAuth } from '@orbitelco/common';
import { getApiAccessArray } from '../utils/loadApiAccessArray';

// In test use .env file for environment variables
require('dotenv').config();

// ======================= Mock the ApiAccessArray =========================
jest.mock('../utils/loadApiAccessArray', () => ({
  getApiAccessArray: jest.fn(),
}));
(getApiAccessArray as jest.Mock).mockResolvedValue(apiAccessAuth);

// === Mock the Role.find mongoose call used inthe get-user-roles.ts API ===
// jest.mock('@orbitelco/common', () => {
//   const originalModule = jest.requireActual('@orbitelco/common');
//   const { Role } = originalModule;
//   // Create a mock implementation for Role.find() returning an array of objects with toJSON method
//   const mockFind = jest.fn().mockReturnValue({
//     map: jest.fn().mockImplementation(() => {
//       // Return objects with a toJSON method
//       return roles.map((role) => ({
//         toJSON: jest.fn().mockReturnValue({
//           role: role.role,
//           roleDisplay: role.roleDisplay,
//         }),
//       }));
//     }),
//   });
//   // Assign the mock find function to the Role model
//   (mongoose.model('Role') as any).find = mockFind;
//   return {
//     ...originalModule,
//     Role, // : mockedRole,
//   };
// });
// =======================================================
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
