import express, { Request, Response } from 'express';
// import { body } from 'express-validator';
// import { validateRequest } from '@orbitelco/common';

import { Product, IProductObj } from '../models/productModel';

const router = express.Router();

// router.post(
//   '/api/products/v2',
//   [body('name').trim().notEmpty().withMessage('Product name can not be empty')],
//   validateRequest,

// @desc    Create a product
// @route   POST /api/products/v1
// @access  Admin
// @req     user._id
// @res     status(201).json(createdProduct)
router.post('/api/products/v2', async (req: Request, res: Response) => {
  const productObject: IProductObj = {
    name: 'Sample name',
    imageURL: process.env.CLOUDINARY_SAMPLE_IMAGE_URL!,
    brand: 'Sample brand',
    category: 'Sample category',
    description: 'Sample description',
    numReviews: 0,
    price: 0,
    countInStock: 0,
  };
  console.log('productObject', productObject);
  const product = Product.build(productObject);
  console.log('product', product);
  try {
    await product.save();
  } catch (err) {
    console.log(err);
  }
  res.status(201).send(product);
});

export { router as createProductRouter };
