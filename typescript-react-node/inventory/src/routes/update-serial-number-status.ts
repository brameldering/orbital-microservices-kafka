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

const updateSerialNumberStatusRouter = (inventoryDB: PrismaClient) => {
  // @desc    Update the status of a serial number
  // @route   PUT /api/inventory/v2/serials/:productId/:serialNumber
  // @access  Admin
  // @req     params.productId
  // @req     params.serialNumber
  //          body {Product}
  // @res     (Serial Number)
  //       or status(404).ObjectNotFoundError(Serial Number not found)
  router.put(
    INVENTORY_SERIALS_URL + '/:productId/:serialNumber',
    cacheMiddlewarePostgres,
    (req: IExtendedRequest, res: Response, next: NextFunction) =>
      authorize(INVENTORY_APIS, req.apiAccessCache || [])(req, res, next),
    async (req: IExtendedRequest, res: Response) => {
      /*  #swagger.tags = ['Inventory']
      #swagger.description = 'Update the status of a serial number'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['productId'] = {
              in: 'path',
              description: 'Product id of serialNumber to update',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['serialNumber'] = {
              in: 'path',
              description: 'serialNumber of serialNumber to update',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['Serial Number'] = {
              in: 'body',
              description: 'Serial Number object',
              required: 'true',
              type: 'object',
      }
      #swagger.responses[200] = {
            description: 'Updated Serial Number'
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Serial Number not found)'
      }
  } */
      const productId = req.params.productId;
      const serialNumber = req.params.serialNumber;

      const { status } = req.body;
      const serialNumberObj = await inventoryDB.serial_number.findUnique({
        where: {
          product_id_serial_number: {
            product_id: productId,
            serial_number: serialNumber,
          },
        },
      });
      if (serialNumberObj) {
        const updatedSerialNumberPostgres =
          await inventoryDB.serial_number.update({
            where: {
              product_id_serial_number: {
                product_id: productId,
                serial_number: serialNumber,
              },
            },
            data: {
              status: status,
            },
          });

        // Casting BigInt to Number for json stringify to work in res.send
        const updatedSerialNumberObj = {
          productId: updatedSerialNumberPostgres.product_id,
          serialNumber: updatedSerialNumberPostgres.serial_number,
          status: updatedSerialNumberPostgres.status,
        };

        res.send(updatedSerialNumberObj);
      } else {
        throw new ObjectNotFoundError('Serial Number not found');
      }
    }
  );
  return router;
};

export { updateSerialNumberStatusRouter };
