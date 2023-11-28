import express, { Request, Response } from 'express';
import { SEED_DATA_URL } from '@orbitelco/common';
import { idSequenceSchema } from '../../models/seqIdModel';
import { userSchema } from '../../models/userModel';
import { productSchema } from '../../models/productModel';
import { orderSchema } from '../../models/orderModel';
import idSequences from '../../seederdata/idSequences';
import products from '../../seederdata/products';
import users from '../../seederdata/users';
import { seqDB, authDB, prodDB, ordersDB } from '../../src/server';

const router = express.Router();

// @desc    Seed data to databases
// @route   POST /api/seeddata/v2
// @access  Public
// @req
// @res     status(201).()
router.post(SEED_DATA_URL, async (req: Request, res: Response) => {
  // Create models specific to each connection
  const OrderInProdDB = ordersDB.model('Order', orderSchema);
  const ProductInProdDB = prodDB.model('Product', productSchema);
  const UserInAuthDB = authDB.model('User', userSchema);
  const IdSequenceInSeqDB = seqDB.model('IdSequence', idSequenceSchema);

  await OrderInProdDB.deleteMany();
  await ProductInProdDB.deleteMany();
  await UserInAuthDB.deleteMany();
  await IdSequenceInSeqDB.deleteMany();

  await IdSequenceInSeqDB.insertMany(idSequences);

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
