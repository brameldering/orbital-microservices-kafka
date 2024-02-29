import express, { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import {
  INVENTORY_SERIALS_URL,
  IExtendedRequest,
  cacheMiddlewarePostgres,
  authorize,
  INVENTORY_APIS,
  validateRequest,
} from '@orbital_app/common';

const router = express.Router();

const createSerialNumberRouter = (inventoryDB: PrismaClient) => {
  // Accept PrismaClient as a parameter
  // @desc    Create a new serial number
  // @route   POST /api/inventory/v2/serials/
  // @access  Admin
  // @req     body {productId, serialNumber, status}
  // @res     status(201).send(serial-number)
  //       or status(400).RequestValidationError
  router.post(
    INVENTORY_SERIALS_URL,
    cacheMiddlewarePostgres,
    (req: IExtendedRequest, res: Response, next: NextFunction) =>
      authorize(INVENTORY_APIS, req.apiAccessCache || [])(req, res, next),
    [
      body('productId')
        .trim()
        .notEmpty()
        .withMessage('productId can not be empty'),
      body('serialNumber')
        .trim()
        .notEmpty()
        .withMessage('serialNumber can not be empty'),
      body('status').trim().notEmpty().withMessage('status can not be empty'),
    ],
    validateRequest,
    async (req: IExtendedRequest, res: Response) => {
      /*  #swagger.tags = ['Inventory']
        #swagger.description = 'Create a new serial number for a product'
        #swagger.parameters['productId, serialNumber, status'] = {
            in: 'body',
            description: '{productId, serialNumber, status} info of user',
            required: 'true',
            type: 'object'
       }
        #swagger.responses[201] = {
            description: 'Object containing serial number',
        #swagger.responses[400] = {
          description: 'RequestValidationError',
        #swagger.responses[422] = {
          description: 'That object already exists',
      }
      */
      const { productId, serialNumber, status } = req.body;

      const newSerialNumberPostgres = await inventoryDB.serial_number.create({
        data: {
          product_id: productId,
          serial_number: serialNumber,
          status: status,
        },
      });

      // TO DO move to service layer
      // Translate postgres data format to internal format
      // Casting BigInt to Number for json stringify to work in res.send
      const newSerialNumber = {
        productId: newSerialNumberPostgres.product_id,
        serialNumber: newSerialNumberPostgres.serial_number,
        status: newSerialNumberPostgres.status,
      };

      res.status(201).send(newSerialNumber);
    }
  );

  return router;
};

export { createSerialNumberRouter };
