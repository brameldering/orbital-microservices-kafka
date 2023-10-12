import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IExtendedRequest } from 'types/commonTypes';

import IdSequence from '../general/models/idSequenceModel';
import asyncHandler from '../middleware/asyncHandler';
import { ExtendedError } from '../middleware/errorMiddleware';

import Product from './productModel';

// @desc    Fetch all products
// @route   GET /api/products/v1
// @access  Public
// @req     query.pageNumber (optional)
//          query.keyword (optional)
// @res     status(200).json({ products, page, pages })
const getProducts = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Products']
      #swagger.description = 'Fetch all products'
      #swagger.parameters['pageNumber'] = {
          in: 'query',
          description: 'PageNumber in case of pagination',
          required: 'false',
          type: 'number',
      }
      #swagger.parameters['keyword'] = {
          in: 'query',
          description: 'Keyword in case of searching for products',
          required: 'false',
          type: 'string',
      }
      #swagger.responses[200] = {
          description: 'Object containing products array, pagenumber and total number of pages',
} */
  if (
    !process.env.PRODUCTS_PER_PAGE ||
    isNaN(Number(process.env.PRODUCTS_PER_PAGE))
  ) {
    throw new ExtendedError(
      'PRODUCTS_PER_PAGE setting is missing from .env file or not a number.'
    );
  }
  const pageSize = Number(process.env.PRODUCTS_PER_PAGE);
  let page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  let products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  // Check if page is empty after a delete refresh
  if (page > 1 && products.length === 0) {
    // Current page is empty, set page - 1 and refetch
    page--;
    products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  }
  const pages = Math.ceil(count / pageSize);
  res.status(200).json({ products, page, pages });
});

// @desc    Create a product
// @route   POST /api/products/v1
// @access  Private/Admin
// @req     user._id
// @res     status(201).json(createdProduct)
const createProduct = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Products']
        #swagger.description = 'Create a product'
        #swagger.parameters['user._id'] = {
            in: 'request',
            description: 'user._id, will automatically be in the request object if the user is logged in',
            required: 'true',
            type: 'string',
        }
        #swagger.responses[201] = {
            description: 'Returns the created product',
} */
    const seqProductId = await IdSequence.findOneAndUpdate(
      { sequenceName: 'sequenceProductId' },
      { $inc: { sequenceCounter: 1 } },
      { returnOriginal: false, upsert: true }
    );
    const sequenceProductId =
      'PRD-' + seqProductId.sequenceCounter.toString().padStart(8, '0');
    if (!(req.user && req.user._id)) {
      throw new ExtendedError('No user JWT has been passed to this request.');
    }
    const product = new Product({
      sequenceProductId,
      name: 'Sample name',
      imageURL: process.env.CLOUDINARY_SAMPLE_IMAGE_URL,
      brand: 'Sample brand',
      category: 'Sample category',
      description: 'Sample description',
      numReviews: 0,
      price: 0,
      countInStock: 0,
      userId: req.user._id,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  }
);

// @desc    Fetch products corresponding to array of Ids
// @route   GET /api/products/v1/productsforids
// @access  Public
// @req     query.productids (string of comma separated product id's)
// @res     status(200).json({ products })
const getProductsForIds = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Products']
      #swagger.description = 'Fetch products corresponding to array of Ids'
      #swagger.parameters['productids'] = {
              in: 'query',
              description: 'String of comma separated product ids',
              required: 'true',
              type: 'string',
      }
      #swagger.responses[200] = {
              description: 'Returns array of corresponding products',
} */
  const productIds: string | undefined = req.query.productids?.toString();
  if (!productIds) {
    throw new ExtendedError(
      'No productIds string has been passed as a query param to this request.'
    );
  }
  const productIdsArray = productIds.trim().split(',');
  const productObjectIds = productIdsArray.map(
    (s) => new mongoose.Types.ObjectId(s)
  );
  // get the product info for the orderItems from the database
  const products = await Product.find({ _id: { $in: productObjectIds } });
  res.status(200).json({ products });
});

// @desc    Fetch single product
// @route   GET /api/products/v1/:id
// @access  Public
// @req     params.id
// @res     status(200).json(product)
//       or status(404).json({ message: 'Product not found' })
const getProductById = asyncHandler(async (req: Request, res: Response) => {
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
            description: 'json({ message: Product not found })'
      }
} */
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.status(200).json(product);
  } else {
    throw new ExtendedError('Product not found', 404);
  }
});

// @desc    Update a product
// @route   PUT /api/products/v1/:id
// @access  Private/Admin
// @req     params.id
//          body {Product}
// @res     status(200).json(updatedProduct)
//       or status(404).json({ message: 'Product not found' })
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Products']
      #swagger.description = 'Update a product'
      #swagger.parameters['id'] = {
              in: 'path',
              description: 'Product id of product to update',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['Product'] = {
              in: 'body',
              description: 'Product object',
              required: 'true',
              type: 'object',
      }
      #swagger.responses[200] = {
              description: 'Updated product',
      }
      #swagger.responses[404] = {
              description: 'json({ message: Product not found })',
} */
  const { name, price, description, imageURL, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.imageURL = imageURL;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    throw new ExtendedError('updateProduct, Product not found', 404);
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/v1/:id
// @access  Private/Admin
// @req     params.id
// @res     status(200).json({ message: 'Product removed' })
//       or status(404).json({ message: 'Product not found' })
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Products']
      #swagger.description = 'Delete a product'
      #swagger.parameters['id'] = {
              in: 'path',
              description: 'Product id of product to delete',
              required: 'true',
              type: 'string',
      }
      #swagger.responses[200] = {
              description: 'json({ message: Product removed })',
      }
      #swagger.responses[404] = {
              description: 'json({ message: Product not found })',
} */
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Product removed' });
  } else {
    throw new ExtendedError('Product not found', 404);
  }
});

// @desc    Create new review
// @route   POST /api/products/v1/:id/reviews
// @access  Private
// @req     params.id
//          user._id
//          user.name
//          body {rating, comment}
// @res     status(201).json({ message: 'Review added' })
//       or status(400).json({ message: 'You have already reviewed this product' })
//       or status(404).json({ message: 'Product not found' })
const createProductReview = asyncHandler(
  async (req: IExtendedRequest, res: Response) => {
    /* #swagger.tags = ['Products']
      #swagger.description = 'Create new review'
      #swagger.parameters['id'] = {
              in: 'path',
              description: 'Product id of product to review',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['user._id'] = {
              in: 'request',
              description: 'user._id, will automatically be in the request object if the user is logged in',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['user.name'] = {
              in: 'request',
              description: 'user.name, will automatically be in the request object if the user is logged in',
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
              description: 'json({ message: Review added })',
      }
      #swagger.responses[400] = {
              description: 'json({ message: You have already reviewed this product })',
      }
      #swagger.responses[404] = {
              description: 'json({ message: Product not found })',
} */
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      if (!(req.user && req.user._id)) {
        throw new ExtendedError('No user has been passed to this request.');
      }
      const alreadyReviewed = product.reviews.find(
        (review) => review.userId.toString() === req.user!._id!.toString()
      );
      if (alreadyReviewed) {
        throw new ExtendedError('You have already reviewed this product', 400);
      }
      const review = {
        userId: req.user._id,
        userName: req.user.name,
        rating,
        comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      throw new ExtendedError('Product not found', 404);
    }
  }
);

export {
  getProducts,
  createProduct,
  getProductsForIds,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
};
