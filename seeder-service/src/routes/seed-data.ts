import express, { Request, Response } from 'express';
import {
  SEED_DATA_URL,
  sequenceSchema,
  roleSchema,
  apiAccessSchema,
  priceCalcSettingsSchema,
  userSchema,
  productSchema,
  orderSchema,
  roles,
  apiAccessAll,
} from '@orbitelco/common';
import { sequences } from '../../seederdata/sequences';
import { products } from '../../seederdata/products';
import { users } from '../../seederdata/users';
import { priceCalcSettings } from '../../seederdata/price-calc-settings';
import { sequencesDB, authDB, productsDB, ordersDB } from '../../src/server';

const router = express.Router();

// @desc    Seed data to databases
// @route   POST /api/seeddata/v2
// @access  Public
// @req
// @res     status(201).()
router.post(SEED_DATA_URL, async (req: Request, res: Response) => {
  // =============== initialize data connections =================
  const SequencesDB = sequencesDB.model('Sequence', sequenceSchema);

  const OrdersInOrderDB = ordersDB.model('Order', orderSchema);
  const AccessInOrderDB = ordersDB.model('ApiAccess', apiAccessSchema);
  const PriceCalcSettingsInOrderDB = ordersDB.model(
    'PriceCalcSettings',
    priceCalcSettingsSchema
  );

  const ProductsInProductDB = productsDB.model('Product', productSchema);
  const AccessInProductDB = productsDB.model('ApiAccess', apiAccessSchema);

  const UserInAuthDB = authDB.model('User', userSchema);
  const RolesInAuthDB = authDB.model('Roles', roleSchema);
  const AccessInAuthDB = authDB.model('ApiAccess', apiAccessSchema);

  // =============== Delete existing data =================
  await SequencesDB.deleteMany();

  await PriceCalcSettingsInOrderDB.deleteMany();
  await AccessInOrderDB.deleteMany();
  await OrdersInOrderDB.deleteMany();

  await RolesInAuthDB.deleteMany();
  await AccessInAuthDB.deleteMany();
  await UserInAuthDB.deleteMany();

  await AccessInProductDB.deleteMany();
  await ProductsInProductDB.deleteMany();

  // await IdSequenceInSeqDB.deleteMany();

  // =============== Load seed data =================
  await SequencesDB.insertMany(sequences);

  await PriceCalcSettingsInOrderDB.insertMany(priceCalcSettings);
  await AccessInOrderDB.insertMany(apiAccessAll);
  // Note there are no orders to seed

  await RolesInAuthDB.insertMany(roles);
  await AccessInAuthDB.insertMany(apiAccessAll);
  const createdUsers = await UserInAuthDB.insertMany(users);

  const adminUserId = createdUsers[0].id;
  // ====================================
  console.log('adminUserId', adminUserId);

  const sampleProducts = products.map((product) => {
    return { ...product, userId: adminUserId };
  });

  await ProductsInProductDB.insertMany(sampleProducts);
  await AccessInProductDB.insertMany(apiAccessAll);

  console.log('Data Imported Succesfully!');
  res.status(201).send('Data Imported Successfully');
});

export { router as seedDataRouter };
