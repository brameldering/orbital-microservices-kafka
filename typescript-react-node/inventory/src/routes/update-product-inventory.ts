import express, { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  PRODUCT_INVENTORY_URL,
  IExtendedRequest,
  cacheMiddlewarePostgres,
  authorize,
  INVENTORY_APIS,
  ObjectNotFoundError,
  kafkaWrapper,
  Topics,
} from '@orbital_app/common';

const router = express.Router();

const updateProductInventoryRouter = (inventoryDB: PrismaClient) => {
  // @desc    Update a product inventory
  // @route   PUT /api/inventory/v2/products/:id
  // @access  Admin
  // @req     params.id
  //          body {Product}
  // @res     (updatedProduct)
  //       or status(404).ObjectNotFoundError(Product inventory not found)
  router.put(
    PRODUCT_INVENTORY_URL + '/:id',
    cacheMiddlewarePostgres,
    (req: IExtendedRequest, res: Response, next: NextFunction) =>
      authorize(INVENTORY_APIS, req.apiAccessCache || [])(req, res, next),
    async (req: IExtendedRequest, res: Response) => {
      /*  #swagger.tags = ['Inventory']
      #swagger.description = 'Update a product inventory'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
              in: 'path',
              description: 'Product id of product inventory to update',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['Product'] = {
              in: 'body',
              description: 'Product inventory object',
              required: 'true',
              type: 'object',
      }
      #swagger.responses[200] = {
            description: 'Updated product inventory'
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Product inventory not found)'
      }
  } */
      const productId = req.params.id;
      const { quantity } = req.body;
      const productQuantity = await inventoryDB.product_quantity.findUnique({
        where: {
          product_id: productId,
        },
      });
      if (productQuantity) {
        const updatedProductQuantityPostgres =
          await inventoryDB.product_quantity.update({
            where: {
              product_id: productId,
            },
            data: {
              quantity: quantity,
            },
          });

        // Post created product on kafka
        await kafkaWrapper.publishers[Topics.InventoryUpdated].publish(
          productId,
          {
            productId: productId,
            quantity: quantity,
          }
        );

        // Casting BigInt to Number for json stringify to work in res.send
        const updatedProductQuantity = {
          productId: updatedProductQuantityPostgres.product_id,
          quantity: Number(updatedProductQuantityPostgres.quantity),
        };

        res.send(updatedProductQuantity);
      } else {
        throw new ObjectNotFoundError('Product inventory not found');
      }
    }
  );
  return router;
};

export { updateProductInventoryRouter };
