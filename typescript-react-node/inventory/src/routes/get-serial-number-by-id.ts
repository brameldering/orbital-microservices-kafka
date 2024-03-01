import express, { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  INVENTORY_SERIALS_URL,
  IExtendedRequest,
  cacheMiddlewarePostgres,
  authorize,
  INVENTORY_APIS,
  ObjectNotFoundError,
} from '@orbital_app/common';

const router = express.Router();

const getSerialNumberByIdRouter = (inventoryDB: PrismaClient) => {
  // Accept PrismaClient as a parameter
  // @desc    Fetch serial number for a product
  // @route   GET /api/inventory/v2/serials/:productId/:serialNumber
  // @access  Public
  // @req     params.productId
  //          params.serialNumber
  // @res     json({ serial-number })
  router.get(
    INVENTORY_SERIALS_URL + '/:productId/:serialNumber',
    cacheMiddlewarePostgres,
    (req: IExtendedRequest, res: Response, next: NextFunction) =>
      authorize(INVENTORY_APIS, req.apiAccessCache || [])(req, res, next),
    async (req: IExtendedRequest, res: Response) => {
      /*  #swagger.tags = ['Inventory']
        #swagger.description = 'Fetch serial number for a product'
        #swagger.parameters['productId'] = {
            in: 'path',
            description: 'product id',
            required: 'true',
            type: 'string'
        }
        #swagger.parameters['serialNumber'] = {
            in: 'path',
            description: 'serial number',
            required: 'true',
            type: 'string'
        }
        #swagger.responses[200] = {
         description: 'Object corresponding to serial number',
      }
      */
      const productId = req.params.productId;
      const serialNumber = req.params.serialNumber;

      const serialNumberPostgres = await inventoryDB.serial_number.findUnique({
        where: {
          product_id_serial_number: {
            product_id: productId,
            serial_number: serialNumber,
          },
        },
      });
      if (serialNumberPostgres) {
        // TO DO move to service layer
        // Translate postgres data format to internal format
        const serialNumberObj = {
          productId: serialNumberPostgres.product_id,
          serialNumber: serialNumberPostgres.serial_number,
          status: serialNumberPostgres.status,
        };

        res.send(serialNumberObj);
      } else {
        throw new ObjectNotFoundError('Serial Number not found');
      }
    }
  );

  return router;
};

export { getSerialNumberByIdRouter };
