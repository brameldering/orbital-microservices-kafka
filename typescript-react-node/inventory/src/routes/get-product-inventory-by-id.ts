import express, { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  PRODUCT_INVENTORY_URL,
  IExtendedRequest,
  cacheMiddlewarePostgres,
  authorize,
  INVENTORY_APIS,
  ObjectNotFoundError,
} from '@orbital_app/common';

const router = express.Router();

const getProductInventoryByIdRouter = (inventoryDB: PrismaClient) => {
  // @desc    Fetch single product inventory
  // @route   GET /api/inventory/v2/products/:productId
  // @access  Public
  // @req     params.productId
  // @res     json(product)
  //       or status(404).ObjectNotFoundError(Product not found)
  router.get(
    PRODUCT_INVENTORY_URL + '/:productId',
    cacheMiddlewarePostgres,
    (req: IExtendedRequest, res: Response, next: NextFunction) =>
      authorize(INVENTORY_APIS, req.apiAccessCache || [])(req, res, next),
    async (req: IExtendedRequest, res: Response) => {
      /*  #swagger.tags = ['Inventory']
      #swagger.description = 'Fetch single product inventory'
      #swagger.parameters['productId'] = {
            in: 'path',
            description: 'product id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
            description: 'Corresponding product inventory'
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Product inventory not found)'
      }
} */
      const productInventoryPostgres =
        await inventoryDB.product_inventory.findUnique({
          where: {
            product_id: req.params.productId,
          },
          include: {
            quantity: true,
          },
        });
      if (productInventoryPostgres) {
        // TO DO move to service layer
        // Translate postgres data format to internal format
        // Casting BigInt to Number for json stringify to work in res.send
        const productInventory = {
          productId: productInventoryPostgres.product_id,
          name: productInventoryPostgres.name,
          brand: productInventoryPostgres.brand,
          category: productInventoryPostgres.category,
          quantity: Number(productInventoryPostgres.quantity?.quantity),
        };

        res.send(productInventory);
      } else {
        throw new ObjectNotFoundError('Product inventory not found');
      }
    }
  );
  return router;
};

export { getProductInventoryByIdRouter };
