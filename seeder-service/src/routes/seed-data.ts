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
import { invProducts } from '../../seederdata/inventory';
import {
  sequencesDB,
  authDB,
  productsDB,
  ordersDB,
  inventoryDB,
} from '../../src/server';
import { postgresTableExists } from '../../utils/check-table-exists';
import { runCommand } from '../../utils/run-npx-command';

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
  console.log('Deleting existing data...');
  // SequencesDB
  await SequencesDB.deleteMany();

  // OrderDB
  await PriceCalcSettingsInOrderDB.deleteMany();
  await AccessInOrderDB.deleteMany();
  await OrdersInOrderDB.deleteMany();

  // AuthDB
  await RolesInAuthDB.deleteMany();
  await AccessInAuthDB.deleteMany();
  await UserInAuthDB.deleteMany();

  // ProductDB
  await AccessInProductDB.deleteMany();
  await ProductsInProductDB.deleteMany();

  // Create prisma schema and client
  await runCommand('npx prisma migrate dev --name init');
  await runCommand('npx prisma generate');
  console.log('Migration and Prisma client generation complete.');

  // InventoryDB
  if (await postgresTableExists('inventory', 'serial_number')) {
    console.log(
      `There are ${await inventoryDB.serial_number.count()} records in inventory.serial_number`
    );
    await inventoryDB.serial_number.deleteMany();
    console.log('Deleted records from inventory.serial_number');
  }
  if (await postgresTableExists('inventory', 'product_quantity')) {
    console.log(
      `There are ${await inventoryDB.product_quantity.count()} records in inventory.product_quantity`
    );
    await inventoryDB.product_quantity.deleteMany();
    console.log('Deleted records from inventory.product_quantity');
  }
  if (await postgresTableExists('inventory', 'product')) {
    console.log(
      `There are ${await inventoryDB.product.count()} records in inventory.product`
    );
    await inventoryDB.product.deleteMany();
    console.log('Deleted records from inventory.product');
  }
  console.log('Deleted existing data');

  // =============== Load seed data =================
  console.log('Seeding data...');
  // SequencesDB
  await SequencesDB.insertMany(sequences);
  console.log(
    `Seeded ${await SequencesDB.countDocuments()} records in SequencesDB`
  );

  // OrderDB
  await PriceCalcSettingsInOrderDB.insertMany(priceCalcSettings);
  console.log(
    `Seeded ${await PriceCalcSettingsInOrderDB.countDocuments()} records in PriceCalcSettingsInOrderDB`
  );
  await AccessInOrderDB.insertMany(apiAccessAll);
  console.log(
    `Seeded ${await AccessInOrderDB.countDocuments()} records in AccessInOrderDB`
  );
  // Note there are no orders to seed

  // AuthDB
  await RolesInAuthDB.insertMany(roles);
  console.log(
    `Seeded ${await RolesInAuthDB.countDocuments()} records in RolesInAuthDB`
  );
  await AccessInAuthDB.insertMany(apiAccessAll);
  console.log(
    `Seeded ${await AccessInAuthDB.countDocuments()} records in AccessInAuthDB`
  );
  const createdUsers = await UserInAuthDB.insertMany(users);

  const adminUserId = createdUsers[0].id;
  // ====================================
  console.log('adminUserId', adminUserId);

  const sampleProducts = products.map((product) => {
    return { ...product, userId: adminUserId };
  });

  // ProductDB
  await ProductsInProductDB.insertMany(sampleProducts);
  console.log(
    `Seeded ${await ProductsInProductDB.countDocuments()} records in ProductsInProductDB`
  );
  await AccessInProductDB.insertMany(apiAccessAll);
  console.log(
    `Seeded ${await AccessInProductDB.countDocuments()} records in AccessInProductDB`
  );

  // InventoryDB
  for (const prod of invProducts) {
    await inventoryDB.product.create({ data: prod });
  }
  console.log(
    `Seeded ${await inventoryDB.product.count()} records in inventory.product`
  );

  // ==================================

  console.log('Data seed succesful');
  res.status(201).send('Data Seed successful');
});

export { router as seedDataRouter };
