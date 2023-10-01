import dotenv from 'dotenv';

import connectDB from './general/db/db';

import IdSequence from './general/models/idSequenceModel';
import Product from './product/productModel';
import User from './user/userModel';
import Order from './order/orderModel';

import idSequences from './general/seederdata/idSequences';
import users from './general/seederdata/users';
import products from './general/seederdata/products';

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

    const adminUserId = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, userId: adminUserId };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await IdSequence.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
