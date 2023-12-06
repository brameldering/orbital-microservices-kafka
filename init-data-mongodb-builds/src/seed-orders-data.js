import mongoose from 'mongoose';
import { apiAccessSchema, apiAccessOrders } from '@orbitelco/common';

const MONGO_URI_ORDERS = 'mongodb://orders-mongo-srv:27017/orders';

const ordersDB = mongoose.createConnection(MONGO_URI_ORDERS);
console.log('Connected to MongoDB', MONGO_URI_ORDERS);

// =============== initialize data connections =================
const AccessInOrderDB = ordersDB.model('ApiAccess', apiAccessSchema);

// =============== Delete existing data =================
await AccessInOrderDB.deleteMany();

// =============== Seed data =================
await AccessInOrderDB.insertMany(apiAccessOrders);

console.log('Auth Data Imported Succesfully!');
