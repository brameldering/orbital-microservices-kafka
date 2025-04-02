import express, { Request, Response } from 'express';

import { SEED_DATA_URL } from '../constants/url-constants';
import { sequenceSchema } from '../models/sequence-model';
import { roleSchema } from '../models/role-model';
import { priceCalcSettingsSchema } from '../models/price-calc-settings-model';
import { userSchema } from '../models/user-model';
import { productSchema } from '../models/product-model';
import { orderSchema } from '../models/order-model';
import { sequences } from '../../seederdata/sequences';
import { products } from '../../seederdata/products';
import { users } from '../../seederdata/users';
import { roles } from '../../seederdata/roles';
import { priceCalcSettings } from '../../seederdata/price-calc-settings';
import { invProducts } from '../../seederdata/inventory';
import {
  sequencesDB,
  authDB,
  productsDB,
  ordersDB,
  inventoryDB,
} from '../server';
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
  // sequencesDB
  const SequencesDB = sequencesDB.model('Sequence', sequenceSchema);

  // authDB
  const UserInAuthDB = authDB.model('User', userSchema);
  const RolesInAuthDB = authDB.model('Roles', roleSchema);

  // productDB
  const ProductsInProductDB = productsDB.model('Product', productSchema);

  // orderDB
  const OrdersInOrderDB = ordersDB.model('Order', orderSchema);
  const PriceCalcSettingsInOrderDB = ordersDB.model(
    'PriceCalcSettings',
    priceCalcSettingsSchema
  );

  // inventoryDB already connected in server.ts

  // =============== Delete existing data =================
  console.log('Deleting existing data...');
  // SequencesDB
  await SequencesDB.deleteMany();

  // AuthDB
  await RolesInAuthDB.deleteMany();
  await UserInAuthDB.deleteMany();

  // ProductDB
  await ProductsInProductDB.deleteMany();

  // OrderDB
  await PriceCalcSettingsInOrderDB.deleteMany();
  await OrdersInOrderDB.deleteMany();

  // InventoryDB
  // Create prisma schema and client
  await runCommand('npx prisma migrate dev --name init');
  await runCommand('npx prisma generate');
  console.log('Migration and Prisma client generation complete.');

  if (await postgresTableExists('inventory', 'serial_number')) {
    console.log(
      `There are ${await inventoryDB.serial_number.count()} records in inventory.serial_number`
    );
    await inventoryDB.serial_number.deleteMany();
  }
  if (await postgresTableExists('inventory', 'product_quantity')) {
    console.log(
      `There are ${await inventoryDB.product_quantity.count()} records in inventory.product_quantity`
    );
    await inventoryDB.product_quantity.deleteMany();
  }
  if (await postgresTableExists('inventory', 'product')) {
    console.log(
      `There are ${await inventoryDB.product.count()} records in inventory.product`
    );
    await inventoryDB.product.deleteMany();
  }
  if (await postgresTableExists('inventory', 'api_access_role')) {
    console.log(
      `There are ${await inventoryDB.api_access_role.count()} records in inventory.api_access_role`
    );
    await inventoryDB.api_access_role.deleteMany();
  }
  if (await postgresTableExists('inventory', 'api_access')) {
    console.log(
      `There are ${await inventoryDB.api_access.count()} records in inventory.api_access`
    );
    await inventoryDB.api_access.deleteMany();
  }
  if (await postgresTableExists('inventory', 'role')) {
    console.log(
      `There are ${await inventoryDB.role.count()} records in inventory.role`
    );
    await inventoryDB.role.deleteMany();
  }
  console.log('Deleted existing data');

  // =============== Load seed data =================
  console.log('Seeding data...');
  // SequencesDB
  await SequencesDB.insertMany(sequences);
  console.log(
    `Seeded ${await SequencesDB.countDocuments()} records in SequencesDB`
  );

  // AuthDB
  await RolesInAuthDB.insertMany(roles);
  console.log(
    `Seeded ${await RolesInAuthDB.countDocuments()} records in RolesInAuthDB`
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

  // OrderDB
  await PriceCalcSettingsInOrderDB.insertMany(priceCalcSettings);
  console.log(
    `Seeded ${await PriceCalcSettingsInOrderDB.countDocuments()} records in PriceCalcSettingsInOrderDB`
  );

  // ====================  Inventory DB ====================
  // InventoryDB - Roles
  for (const role of roles) {
    await inventoryDB.role.create({
      data: {
        role: role.role,
        role_display: role.roleDisplay,
      },
    });
  }
  console.log(
    `Seeded ${await inventoryDB.role.count()} records in inventory.role`
  );

  // InventoryDB - product
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
