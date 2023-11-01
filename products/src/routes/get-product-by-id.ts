import express, { Request, Response } from 'express';
import { Product } from '../productModel';
import {
  PRODUCTS_URL,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Fetch single product
// @route   GET /api/products/v2/:id
// @access  Public
// @req     params.id
// @res     status(200).json(product)
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
      res.send(product);
    } else {
      throw new ObjectNotFoundError('Product not found');
    }
  }
);

export { router as getProductByIdRouter };
