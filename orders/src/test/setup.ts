import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { apiAccessAll } from '@orbitelco/common';
import { getApiAccessArray } from '../utils/loadApiAccessArray';

// In test use .env file for environment variables
require('dotenv').config();

// ==================== Mock the ApiAccessArray =======================
jest.mock('../utils/loadApiAccessArray', () => ({
  getApiAccessArray: jest.fn(),
}));
(getApiAccessArray as jest.Mock).mockResolvedValue(apiAccessAll);

// =================== Mock the PriceCalcSettings =====================
jest.mock('../utils/getPriceCalcSettings', () => ({
  getPriceCalcSettings: jest.fn().mockResolvedValue({
    vatPercentage: 21,
    shippingFee: 4.5,
    thresholdFreeShipping: 100,
  }),
}));

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
