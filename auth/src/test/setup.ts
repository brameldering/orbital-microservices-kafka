import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  roleSchema,
  apiAccessSchema,
  roles,
  apiAccessAuth,
  apiAccessOrders,
  apiAccessProducts,
} from '@orbitelco/common';

// In test use .env file for environment variables
require('dotenv').config();

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

  await loadRolesAndAccessSpecs();
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

const loadRolesAndAccessSpecs = async () => {
  try {
    const RolesInDB = mongoose.connection.model('Role', roleSchema);
    const AccessInDB = mongoose.connection.model('ApiAccess', apiAccessSchema);

    await RolesInDB.insertMany(roles);
    await AccessInDB.insertMany(apiAccessAuth);
    await AccessInDB.insertMany(apiAccessProducts);
    await AccessInDB.insertMany(apiAccessOrders);
  } catch (err) {
    console.log(err);
  }
};
