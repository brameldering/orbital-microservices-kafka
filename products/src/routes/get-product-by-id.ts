import express, { Request, Response } from 'express';
import { Product } from '../productModel';
import { checkObjectId, ObjectNotFoundError } from '@orbitelco/common';

const router = express.Router();

// @desc    Fetch single product
// @route   GET /api/products/v2/:id
// @access  Public
// @req     params.id
// @res     status(200).json(product)
//       or status(404).json({ message: 'Product not found' })
router.get(
  '/api/products/v2/:id',
  checkObjectId,
  async (req: Request, res: Response) => {
    let product;
    try {
      product = await Product.findById(req.params.id);
    } catch (err) {
      console.log('get product by id error', err);
    }
    if (product) {
      res.send(product);
    } else {
      throw new ObjectNotFoundError('Product not found');
    }
  }
);

export { router as getProductByIdRouter };
