import express, { Request, Response } from 'express';
import { Product } from '../models/productModel';
import { ObjectNotFoundError } from '@orbitelco/common';

const router = express.Router();

// @desc    Fetch single product
// @route   GET /api/products/v2/:id
// @access  Public
// @req     params.id
// @res     status(200).json(product)
//       or status(404).json({ message: 'Product not found' })
router.get('/api/products/v2/:id', async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.status(200).json(product);
  } else {
    throw new ObjectNotFoundError('Product not found');
  }
});

export { router as getProductByIdRouter };
