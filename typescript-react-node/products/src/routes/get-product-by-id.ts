import express, { Response, NextFunction } from 'express';
import {
  PRODUCTS_URL,
  Product,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  PRODUCTS_APIS,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbital_app/common';

const router = express.Router();

// @desc    Fetch single product
// @route   GET /api/products/v2/:id
// @access  Public
// @req     params.id
// @res     json(product)
//       or status(404).ObjectNotFoundError(Product not found)
router.get(
  PRODUCTS_URL + '/:id',
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(PRODUCTS_APIS, req.apiAccessCache || [])(req, res, next),
  checkObjectId,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Products']
      #swagger.description = 'Fetch single product'
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'product id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
            description: 'Corresponding product'
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Product not found)'
      }
} */
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product.toJSON());
    } else {
      throw new ObjectNotFoundError('Product not found');
    }
  }
);

export { router as getProductByIdRouter };
