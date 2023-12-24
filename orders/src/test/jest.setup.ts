import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { setupApp } from '../app';

// In test use .env file for environment variables
require('dotenv').config();

// ================== Mock kafka.js ====================
jest.mock('kafkajs', () => {
  const MockAdmin = jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    listTopics: jest.fn(),
    createTopics: jest.fn(),
  }));

  // Mock Kafka class
  const MockKafka = jest.fn().mockImplementation(() => ({
    admin: jest.fn().mockImplementation(() => new MockAdmin()),
  }));

  // Mock logLevel enum
  const logLevel = {
    NOTHING: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 4,
    DEBUG: 5,
  };

  return {
    Kafka: MockKafka,
    logLevel,
  };
});

// ======================= Mock the kafka-wrapper =========================
jest.mock(
  '../../node_modules/@orbitelco/common/build/kafka/kafka-wrapper',
  () => {
    return jest.requireActual(
      '../../node_modules/@orbitelco/common/build/__mocks__/kafka-wrapper'
    );
  }
);

// ======================= Mock the apiAccessCache =========================
jest.mock(
  '../../node_modules/@orbitelco/common/build/middleware/api-access-cache',
  () => {
    return jest.requireActual(
      '../../node_modules/@orbitelco/common/build/__mocks__/api-access-cache'
    );
  }
);

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

  await setupApp();
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
