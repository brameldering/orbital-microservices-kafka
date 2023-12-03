import express, { Response } from 'express';
import mongoose from 'mongoose';
// import { body } from 'express-validator';
// import { validateRequest } from '@orbitelco/common';
import {
  PRODUCT_REVIEW_URL,
  Product,
  ProductReview,
  checkObjectId,
  IExtendedRequest,
  IProductReviewDoc,
  ObjectNotFoundError,
  UserInputError,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Create new review
// @route   POST /api/products/v2/reviews/:id
// @access  Private
// @req     params.id
//          req.currentuser.id
//          req.currentuser.name
//          body {rating, comment}
// @res     status(201).()
//       or status(400).UserInputError('You have already reviewed this product')
//       or status(404).ObjectNotFoundError(Product not found)
router.post(
  PRODUCT_REVIEW_URL + '/:id',
  checkObjectId,
  async (req: IExtendedRequest, res: Response) => {
    /* #swagger.tags = ['Products']
      #swagger.description = 'Create new review'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
      #swagger.parameters['id'] = {
              in: 'path',
              description: 'Product id of product to review',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['req.currentuser.id'] = {
              in: 'request',
              description: 'will automatically be in the request object if the user is logged in',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['req.currentuser.name'] = {
              in: 'request',
              description: 'will automatically be in the request object if the user is logged in',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['rating, comment'] = {
              in: 'body',
              description: 'rating, comment object corresponding to review',
              required: 'true',
              type: 'object',
      }
      #swagger.responses[201] = {
              description: 'empty response',
      }
      #swagger.responses[400] = {
              description: 'UserInputError(You have already reviewed this product)'
      }
      #swagger.responses[404] = {
              description: 'ObjectNotFoundError(Product not found)'
} */
    const userId = new mongoose.Types.ObjectId(req.currentUser!.id);
    const userName = req.currentUser!.name;
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews?.find(
        (review) => review.userId.toString() === userId.toString()
      );
      if (alreadyReviewed) {
        throw new UserInputError('You have already reviewed this product');
      }
      const reviewObject = {
        userId,
        userName,
        rating,
        comment,
      };
      const review: IProductReviewDoc = ProductReview.build(reviewObject);
      if (!product.reviews) {
        product.reviews = [];
      }
      const reviews: IProductReviewDoc[] = product.reviews;
      reviews.push(review);
      product.numReviews = reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).send();
    } else {
      throw new ObjectNotFoundError('Product not found');
    }
  }
);

export { router as createProductReviewRouter };
