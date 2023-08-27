import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import idSequences from './general/seederdata/idSequences.js';
import users from './general/seederdata/users.js';
import products from './general/seederdata/products.js';
import IdSequence from './general/models/idSequenceModel.js';
import User from './user/models/userModel.js';
import Product from './product/models/productModel.js';
import Order from './order/models/orderModel.js';
import connectDB from './general/config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await IdSequence.deleteMany();

    await IdSequence.insertMany(idSequences);

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await IdSequence.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
