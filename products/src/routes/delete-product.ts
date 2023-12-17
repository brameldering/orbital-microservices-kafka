import express, { Request, Response } from 'express';
import {
  PRODUCTS_URL,
  cacheMiddleware,
  authorize,
  PRODUCTS_APIS,
  Product,
  checkObjectId,
  IExtendedRequest,
  ObjectNotFoundError,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Delete a product
// @route   DELETE /api/products/v2/:id
// @access  Admin
// @req     params.id
// @res     ()
//       or status(404).ObjectNotFoundError(Product not found)
router.delete(
  PRODUCTS_URL + '/:id',
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next) =>
    authorize(PRODUCTS_APIS, req.apiAccessCache || [])(req, res, next),
  checkObjectId,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Products']
      #swagger.description = 'Delete a product'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
              in: 'path',
              description: 'Product id of product to delete',
              required: 'true',
              type: 'string',
      }
      #swagger.responses[200] = {
              description: 'Empty result',
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Product not found)'
      }
  } */
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.send();
    } else {
      throw new ObjectNotFoundError('Product not found');
    }
  }
);
export { router as deleteProductRouter };
