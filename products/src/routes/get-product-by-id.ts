import express, { Request, Response } from 'express';
import {
  PRODUCTS_URL,
  Product,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Fetch single product
// @route   GET /api/products/v2/:id
// @access  Public
// @req     params.id
// @res     json(product)
//       or status(404).ObjectNotFoundError(Product not found)
router.get(
  PRODUCTS_URL + '/:id',
  checkObjectId,
  async (req: Request, res: Response) => {
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
