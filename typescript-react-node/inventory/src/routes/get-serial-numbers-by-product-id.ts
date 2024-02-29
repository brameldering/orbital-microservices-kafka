import express, { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  INVENTORY_SERIALS_URL,
  IExtendedRequest,
  cacheMiddlewarePostgres,
  authorize,
  INVENTORY_APIS,
} from '@orbital_app/common';

const router = express.Router();

const getSerialNumbersByProductIdRouter = (inventoryDB: PrismaClient) => {
  // Accept PrismaClient as a parameter
  // @desc    Fetch all serial numbers for a product
  // @route   GET /api/inventory/v2/serials/:productId
  // @access  Public
  // @req     params.productId
  // @res     json({ serial-numbers })
  router.get(
    INVENTORY_SERIALS_URL + '/:productId',
    cacheMiddlewarePostgres,
    (req: IExtendedRequest, res: Response, next: NextFunction) =>
      authorize(INVENTORY_APIS, req.apiAccessCache || [])(req, res, next),
    async (req: IExtendedRequest, res: Response) => {
      /*  #swagger.tags = ['Inventory']
        #swagger.description = 'Fetch all serial numbers for a product'
        #swagger.parameters['productId'] = {
            in: 'path',
            description: 'product id',
            required: 'true',
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Object containing serial numbers array',
        }
      */
      const serialNumbersPostgres = await inventoryDB.serial_number.findMany({
        where: {
          product_id: req.params.productId,
        },
      });

      // TO DO move to service layer
      // Translate postgres data format to internal format
      // Casting BigInt to Number for json stringify to work in res.send
      const serialNumbers = serialNumbersPostgres.map((item) => ({
        productId: item.product_id,
        serialNumber: item.serial_number,
        status: item.status,
      }));

      res.send(serialNumbers);
    }
  );

  return router;
};

export { getSerialNumbersByProductIdRouter };
