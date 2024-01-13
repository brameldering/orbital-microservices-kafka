import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { setupApp } from '../app';

// In test use .env file for environment variables
require('dotenv').config();

// ================== Mock kafka.js ====================
import '../../node_modules/ @orbital_app/common/build/__mocks__/kafkajs';

// ======================= Mock the kafka-wrapper =========================
jest.mock(
  '../../node_modules/ @orbital_app/common/build/kafka/kafka-wrapper',
  () => {
    return jest.requireActual(
      '../../node_modules/ @orbital_app/common/build/__mocks__/kafka-wrapper'
    );
  }
);

// ======================= Mock the apiAccessCache =========================
jest.mock(
  '../../node_modules/ @orbital_app/common/build/middleware/api-access-cache',
  () => {
    return jest.requireActual(
      '../../node_modules/ @orbital_app/common/build/__mocks__/api-access-cache'
    );
  }
);

// ======================= Mock the Publisher abstract class =========================
jest.mock(
  '../../node_modules/ @orbital_app/common/build/kafka/base-publisher',
  () => {
    return jest.requireActual(
      '../../node_modules/ @orbital_app/common/build/__mocks__/base-publisher'
    );
  }
);

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

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
