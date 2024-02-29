import express, { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  PRODUCT_INVENTORY_URL,
  IExtendedRequest,
  cacheMiddlewarePostgres,
  authorize,
  INVENTORY_APIS,
} from '@orbital_app/common';

const router = express.Router();

const getProductInventoryRouter = (inventoryDB: PrismaClient) => {
  // Accept PrismaClient as a parameter
  // @desc    Fetch all products inventory
  // @route   GET /api/inventory/v2/products
  // @access  Public
  // @req     none
  // @res     json({ productInventory })
  router.get(
    PRODUCT_INVENTORY_URL,
    cacheMiddlewarePostgres,
    (req: IExtendedRequest, res: Response, next: NextFunction) =>
      authorize(INVENTORY_APIS, req.apiAccessCache || [])(req, res, next),
    async (req: IExtendedRequest, res: Response) => {
      /*  #swagger.tags = ['Inventory']
        #swagger.description = 'Fetch all inventory products'
        #swagger.responses[200] = {
            description: 'Object containing inventory products array',
      } */
      const productInventoryPostgres =
        await inventoryDB.product_inventory.findMany({
          include: {
            quantity: true,
          },
        });

      // TO DO move to service layer
      // Translate postgres data format to internal format
      // Casting BigInt to Number for json stringify to work in res.send
      const productInventory = productInventoryPostgres.map((item) => ({
        productId: item.product_id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        quantity: Number(item.quantity?.quantity),
      }));

      // console.log('productInventory', productInventory);

      res.send(productInventory);
    }
  );

  return router;
};

export { getProductInventoryRouter };
