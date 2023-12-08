import mongoose from 'mongoose';
import { apiAccessSchema, apiAccessAll } from '@orbitelco/common';

const MONGO_URI_PRODUCTS = 'mongodb://products-mongo-srv:27017/products';

const productsDB = mongoose.createConnection(MONGO_URI_PRODUCTS);
console.log('Connected to MongoDB', MONGO_URI_PRODUCTS);

// =============== initialize data connections =================
const AccessInProductDB = productsDB.model('ApiAccess', apiAccessSchema);

// =============== Delete existing data =================
await AccessInProductDB.deleteMany();

// =============== Seed data =================
await AccessInProductDB.insertMany(apiAccessAll);

console.log('Products Data Imported Succesfully!');
