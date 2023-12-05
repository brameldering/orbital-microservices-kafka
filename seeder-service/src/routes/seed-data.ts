import express, { Request, Response } from 'express';
import {
  SEED_DATA_URL,
  roleSchema,
  apiAccessSchema,
  userSchema,
  productSchema,
  productSequenceSchema,
  orderSchema,
  orderSequenceSchema,
  // idSequenceSchema,
  roles,
  apiAccessAuth,
  apiAccessOrders,
  apiAccessProducts,
} from '@orbitelco/common';
// import { idSequences } from '../../seederdata/id-sequences';
import { products, productSequence } from '../../seederdata/products';
// import {  } from '../../seederdata/api-access/roles';
import { users } from '../../seederdata/users';
// import {  } from '../../seederdata/api-access/api-access-auth';
// import {  } from '../../seederdata/api-access/api-access-orders';
// import {  } from '../../seederdata/api-access/api-access-products';
import { orderSequence } from '../../seederdata/orders';
import { authDB, productsDB, ordersDB } from '../../src/server';

const router = express.Router();

// @desc    Seed data to databases
// @route   POST /api/seeddata/v2
// @access  Public
// @req
// @res     status(201).()
router.post(SEED_DATA_URL, async (req: Request, res: Response) => {
  // =============== initialize data connections =================
  const OrdersInOrderDB = ordersDB.model('Order', orderSchema);
  const AccessInOrderDB = ordersDB.model('ApiAccess', apiAccessSchema);
  const OrderSeqInOrderDB = ordersDB.model(
    'OrderSequence',
    orderSequenceSchema
  );

  const ProductsInProductDB = productsDB.model('Product', productSchema);
  const AccessInProductDB = productsDB.model('ApiAccess', apiAccessSchema);
  const ProductSeqInProductDB = productsDB.model(
    'ProductSequence',
    productSequenceSchema
  );

  const UserInAuthDB = authDB.model('User', userSchema);
  const RolesInAuthDB = authDB.model('Roles', roleSchema);
  const AccessInAuthDB = authDB.model('ApiAccess', apiAccessSchema);
  const AllAccessInAuthDB = authDB.model('AllApiAccess', apiAccessSchema);
  // const IdSequenceInSeqDB = seqDB.model('IdSequence', idSequenceSchema);

  // =============== Delete existing data =================
  await OrderSeqInOrderDB.deleteMany();
  await AccessInOrderDB.deleteMany();
  await OrdersInOrderDB.deleteMany();

  await RolesInAuthDB.deleteMany();
  await AccessInAuthDB.deleteMany();
  await AllAccessInAuthDB.deleteMany();
  await UserInAuthDB.deleteMany();

  await ProductSeqInProductDB.deleteMany();
  await AccessInProductDB.deleteMany();
  await ProductsInProductDB.deleteMany();

  // await IdSequenceInSeqDB.deleteMany();

  // =============== Load seed data =================
  await OrderSeqInOrderDB.insertMany(orderSequence);
  await AccessInOrderDB.insertMany(apiAccessOrders);
  // Note there are no orders to seed

  await RolesInAuthDB.insertMany(roles);
  await AccessInAuthDB.insertMany(apiAccessAuth);
  await AllAccessInAuthDB.insertMany(apiAccessAuth);
  await AllAccessInAuthDB.insertMany(apiAccessProducts);
  await AllAccessInAuthDB.insertMany(apiAccessOrders);
  const createdUsers = await UserInAuthDB.insertMany(users);

  const adminUserId = createdUsers[0].id;
  // ====================================
  console.log('adminUserId', adminUserId);

  const sampleProducts = products.map((product) => {
    return { ...product, userId: adminUserId };
  });

  await ProductsInProductDB.insertMany(sampleProducts);
  await AccessInProductDB.insertMany(apiAccessProducts);
  await ProductSeqInProductDB.insertMany(productSequence);

  console.log('Data Imported Succesfully!');
  res.status(201).send('Data Imported Successfully');
});

export { router as seedDataRouter };
