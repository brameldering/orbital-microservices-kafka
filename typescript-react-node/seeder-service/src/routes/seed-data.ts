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
  apiAccessAuth,
  apiAccessProducts,
  apiAccessOrders,
  apiAccessInventory,
} from '@orbital_app/common';
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
// import { runCommand } from '../../utils/run-npx-command';

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
  const AccessInAuthDB = authDB.model('ApiAccess', apiAccessSchema);

  // productDB
  const ProductsInProductDB = productsDB.model('Product', productSchema);
  const AccessInProductDB = productsDB.model('ApiAccess', apiAccessSchema);

  // orderDB
  const OrdersInOrderDB = ordersDB.model('Order', orderSchema);
  const AccessInOrderDB = ordersDB.model('ApiAccess', apiAccessSchema);
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
  await AccessInAuthDB.deleteMany();
  await UserInAuthDB.deleteMany();

  // ProductDB
  await AccessInProductDB.deleteMany();
  await ProductsInProductDB.deleteMany();

  // OrderDB
  await PriceCalcSettingsInOrderDB.deleteMany();
  await AccessInOrderDB.deleteMany();
  await OrdersInOrderDB.deleteMany();

  // InventoryDB
  // Create prisma schema and client
  // await runCommand('npx prisma migrate dev --name init');
  // await runCommand('npx prisma generate');
  // console.log('Migration and Prisma client generation complete.');

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
  if (await postgresTableExists('inventory', 'product_inventory')) {
    console.log(
      `There are ${await inventoryDB.product_inventory.count()} records in inventory.product_inventory`
    );
    await inventoryDB.product_inventory.deleteMany();
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
  // AuthDB contains all access records
  await AccessInAuthDB.insertMany(apiAccessAuth);
  await AccessInAuthDB.insertMany(apiAccessProducts);
  await AccessInAuthDB.insertMany(apiAccessOrders);
  await AccessInAuthDB.insertMany(apiAccessInventory);
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
  await AccessInProductDB.insertMany(apiAccessProducts);
  console.log(
    `Seeded ${await AccessInProductDB.countDocuments()} records in AccessInProductDB`
  );

  // OrderDB
  await PriceCalcSettingsInOrderDB.insertMany(priceCalcSettings);
  console.log(
    `Seeded ${await PriceCalcSettingsInOrderDB.countDocuments()} records in PriceCalcSettingsInOrderDB`
  );
  await AccessInOrderDB.insertMany(apiAccessOrders);
  console.log(
    `Seeded ${await AccessInOrderDB.countDocuments()} records in AccessInOrderDB`
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

  // InventoryDB - apiAccess
  // Create api_access records
  for (const apiAccess of apiAccessInventory) {
    await inventoryDB.api_access.create({
      data: {
        api_name: apiAccess.apiName,
        microservice: apiAccess.microservice,
        // Not yet include the allowed_roles connection
      },
    });
  }
  console.log(
    `Seeded ${await inventoryDB.api_access.count()} records in inventory.api_access`
  );

  // Fill the many-to-many relation table api_access_role
  for (const apiAccess of apiAccessInventory) {
    // Fetch the roles to connect with the current api_access record
    const allowedRoles = await inventoryDB.role.findMany({
      where: {
        role: { in: apiAccess.allowedRoles },
      },
    });
    // Insert records directly into the join table
    for (const role of allowedRoles) {
      await inventoryDB.api_access_role.create({
        data: {
          api_access_name: apiAccess.apiName,
          role_id: role.role,
        },
      });
    }
  }
  console.log(
    `Seeded ${await inventoryDB.api_access_role.count()} records in inventory.api_access_role`
  );
  // InventoryDB - product
  for (const prod of invProducts) {
    await inventoryDB.product_inventory.create({ data: prod });
  }
  console.log(
    `Seeded ${await inventoryDB.product_inventory.count()} records in inventory.product_inventory`
  );

  // ==================================

  console.log('Data seed succesful');
  res.status(201).send('Data Seed successful');
});

export { router as seedDataRouter };
