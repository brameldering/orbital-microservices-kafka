import express, { Response } from 'express';
import mongoose from 'mongoose';
// import { body } from 'express-validator';
// import { validateRequest } from '@orbitelco/common';
import {
  PRODUCTS_URL,
  Product,
  IExtendedRequest,
  IProductObj,
  ProductSequence,
  DatabaseError,
} from '@orbitelco/common';

const router = express.Router();

// router.post(
//   '/api/products/v2',
//   [body('name').trim().notEmpty().withMessage('Product name can not be empty')],
//   validateRequest,

// @desc    Create a product
// @route   POST /api/products/v2
// @access  Admin
// @req     req.currentuser.id
// @res     status(201).(createdProduct)
router.post(PRODUCTS_URL, async (req: IExtendedRequest, res: Response) => {
  /*  #swagger.tags = ['Products']
        #swagger.description = 'Create a product'
        #swagger.security = [{
        bearerAuth: ['admin']
      }]
        #swagger.parameters['req.currentUser!.id'] = {
            in: 'request',
            description: 'will automatically be in the request object if the user is logged in',
            required: 'true',
            type: 'string',
        }
        #swagger.responses[201] = {
            description: 'Returns the created product',
        #swagger.responses[422] = {
              description: 'That object already exists',
} */
  const userId = new mongoose.Types.ObjectId(req.currentUser!.id);

  const seqNumberProductId = await ProductSequence.findOneAndUpdate(
    {},
    { $inc: { latestSeqId: 1 } },
    { returnOriginal: false, upsert: true }
  );
  if (seqNumberProductId) {
    console.log('seqNumberProductId', seqNumberProductId);
    console.log(
      'seqNumberProductId.latestSeqId',
      seqNumberProductId.latestSeqId
    );
    const sequentialProductId: string =
      'PRD-' + seqNumberProductId.latestSeqId.toString().padStart(10, '0');

    const productObject: IProductObj = {
      sequentialProductId,
      name: 'Sample name',
      imageURL: process.env.CLOUDINARY_SAMPLE_IMAGE_URL!,
      brand: 'Sample brand',
      category: 'Sample category',
      description: 'Sample description',
      numReviews: 0,
      reviews: [],
      price: 0,
      countInStock: 0,
      userId,
    };
    const product = Product.build(productObject);
    await product.save();
    res.status(201).send(product.toJSON());
  } else {
    throw new DatabaseError('Error determining sequential Product Id');
    // console.log("Log error details")
  }
});

export { router as createProductRouter };
