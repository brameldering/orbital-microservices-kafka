import express, { Response } from 'express';
import mongoose from 'mongoose';
// import { body } from 'express-validator';
// import { validateRequest } from '@orbitelco/common';
import { Product } from '../productModel';
import {
  PRODUCTS_URL,
  IExtendedRequest,
  IProductObj,
  protect,
  admin,
} from '@orbitelco/common';

const router = express.Router();

// router.post(
//   '/api/products/v2',
//   [body('name').trim().notEmpty().withMessage('Product name can not be empty')],
//   validateRequest,

// @desc    Create a product
// @route   POST /api/products/v1
// @access  Admin
// @req     req.currentuser.id
// @res     status(201).json(createdProduct)
router.post(
  PRODUCTS_URL,
  protect,
  admin,
  async (req: IExtendedRequest, res: Response) => {
    const userId = new mongoose.Types.ObjectId(req.currentUser!.id);
    const productObject: IProductObj = {
      name: 'Sample name',
      imageURL: process.env.CLOUDINARY_SAMPLE_IMAGE_URL!,
      brand: 'Sample brand',
      category: 'Sample category',
      description: 'Sample description',
      numReviews: 0,
      price: 0,
      countInStock: 0,
      userId,
    };
    const product = Product.build(productObject);
    await product.save();
    res.status(201).send(product);
  }
);

export { router as createProductRouter };
