import mongoose from 'mongoose';
import {
  roleSchema,
  apiAccessSchema,
  roles,
  apiAccessAll,
} from '@orbitelco/common';

const MONGO_URI_AUTH = 'mongodb://auth-mongo-service:27017/auth';

const authDB = mongoose.createConnection(MONGO_URI_AUTH);
console.log('Connected to MongoDB', MONGO_URI_AUTH);

// =============== initialize data connections =================
const RolesInAuthDB = authDB.model('Role', roleSchema);
const AccessInAuthDB = authDB.model('ApiAccess', apiAccessSchema);
// const AllAccessInAuthDB = authDB.model('AllApiAccess', apiAccessSchema);

// =============== Delete existing data =================
await RolesInAuthDB.deleteMany();
await AccessInAuthDB.deleteMany();
// await AllAccessInAuthDB.deleteMany();

// =============== Seed data =================
await RolesInAuthDB.insertMany(roles);
await AccessInAuthDB.insertMany(apiAccessAll);
// await AllAccessInAuthDB.insertMany(apiAccessAuth);
// await AllAccessInAuthDB.insertMany(apiAccessProducts);
// await AllAccessInAuthDB.insertMany(apiAccessOrders);

console.log('Auth Data Imported Succesfully!');
