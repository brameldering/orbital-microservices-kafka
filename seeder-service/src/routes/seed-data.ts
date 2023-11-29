import express, { Request, Response } from 'express';
import {
  SEED_DATA_URL,
  userSchema,
  productSchema,
  productSequenceSchema,
  orderSchema,
  orderSequenceSchema,
  // idSequenceSchema,
} from '@orbitelco/common';
// import { idSequences } from '../../seederdata/id-sequences';
import { products, productSequence } from '../../seederdata/products';
import { users } from '../../seederdata/users';
import { orderSequence } from '../../seederdata/orders';
import { authDB, prodDB, ordersDB } from '../../src/server';

const router = express.Router();

// @desc    Seed data to databases
// @route   POST /api/seeddata/v2
// @access  Public
// @req
// @res     status(201).()
router.post(SEED_DATA_URL, async (req: Request, res: Response) => {
  // Create models specific to each connection
  const OrderInOrderDB = ordersDB.model('Order', orderSchema);
  const OrderSeqInOrderDB = ordersDB.model(
    'OrderSequence',
    orderSequenceSchema
  );
  const ProductInProdDB = prodDB.model('Product', productSchema);
  const ProductSeqInProdDB = prodDB.model(
    'ProductSequence',
    productSequenceSchema
  );
  const UserInAuthDB = authDB.model('User', userSchema);
  // const IdSequenceInSeqDB = seqDB.model('IdSequence', idSequenceSchema);

  await OrderSeqInOrderDB.deleteMany();
  await ProductSeqInProdDB.deleteMany();
  await OrderInOrderDB.deleteMany();
  await ProductInProdDB.deleteMany();
  await UserInAuthDB.deleteMany();
  // await IdSequenceInSeqDB.deleteMany();

  await OrderSeqInOrderDB.insertMany(orderSequence);
  await ProductSeqInProdDB.insertMany(productSequence);

  const createdUsers = await UserInAuthDB.insertMany(users);

  const adminUserId = createdUsers[0].id;
  // ====================================
  console.log('adminUserId', adminUserId);

  const sampleProducts = products.map((product) => {
    return { ...product, userId: adminUserId };
  });

  await ProductInProdDB.insertMany(sampleProducts);

  console.log('Data Imported Succesfully!');
  res.status(201).send('Data Imported Successfully');
});

export { router as seedDataRouter };
