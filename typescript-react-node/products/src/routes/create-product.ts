import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
// import { body } from 'express-validator';
// import { validateRequest } from '@orbital_app/common';
import {
  PRODUCTS_URL,
  Product,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  PRODUCTS_APIS,
  IProductAttrs,
  kafkaWrapper,
  Topics,
  GENERATING,
} from '@orbital_app/common';

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
router.post(
  PRODUCTS_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(PRODUCTS_APIS, req.apiAccessCache || [])(req, res, next),
  async (req: IExtendedRequest, res: Response) => {
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

    const sequentialProductId = GENERATING;
    const productObject: IProductAttrs = {
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
    const savedProduct = await product.save();

    // Request generating sequence number: Publish SequenceRequestEvent
    await kafkaWrapper.publishers[Topics.SequenceRequestProducts].publish(
      savedProduct._id.toString(),
      {
        entityObjectId: savedProduct._id,
      }
    );
    // Note that the product create event will be published by the SequenceResponseProducts listener

    res.status(201).send(savedProduct.toJSON());
  }
);

export { router as createProductRouter };
