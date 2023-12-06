import mongoose from 'mongoose';
import {
  roleSchema,
  apiAccessSchema,
  roles,
  apiAccessAuth,
  apiAccessOrders,
  apiAccessProducts,
} from '@orbitelco/common';

const mongoURI = 'mongodb://auth-mongo-srv:27017/auth';

// Establishing the connection
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Get the default connection
// const db = mongoose.connection;

// // Event handling for successful connection
// db.on('connected', () => {
//   console.log('Connected to MongoDB');
// });

// // Event handling for connection errors
// db.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });

// =============== initialize data connections =================
// const RolesInAuthDB = authDB.model('Role', roleSchema);
// const AccessInAuthDB = authDB.model('ApiAccess', apiAccessSchema);
// const AllAccessInAuthDB = authDB.model('AllApiAccess', apiAccessSchema);

// =============== Delete existing data =================
// await RolesInAuthDB.deleteMany();
// await AccessInAuthDB.deleteMany();
// await AllAccessInAuthDB.deleteMany();

// =============== Seed data =================
// await RolesInAuthDB.insertMany(roles);
// await AccessInAuthDB.insertMany(apiAccessAuth);
// await AllAccessInAuthDB.insertMany(apiAccessAuth);
// await AllAccessInAuthDB.insertMany(apiAccessProducts);
// await AllAccessInAuthDB.insertMany(apiAccessOrders);

console.log('Auth Data Imported Succesfully!');
