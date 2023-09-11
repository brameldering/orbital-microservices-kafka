import asyncHandler from '../../general/middleware/asyncHandler.js';
import { ExtendedError } from '../../general/middleware/errorMiddleware.js';
import IdSequence from '../../general/models/idSequenceModel.js';
import Product from '../models/productModel.js';
import { CLOUDINARY_SAMPLE_IMAGE_URL } from '../../constantsBackend.js';

// @desc    Fetch all products
// @route   GET /api/products/v1
// @access  Public
// @req     query.pageNumber (optional)
//          query.keyword (optional)
// @res     status(200).json({ products, page, pages })
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PRODUCTS_PER_PAGE;
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
//          body {product}
// @res     status(201).json(createdProduct)
const createProduct = asyncHandler(async (req, res) => {
  const seqProductId = await IdSequence.findOneAndUpdate(
    { sequenceName: 'sequenceProductId' },
    { $inc: { sequenceCounter: 1 } },
    { returnOriginal: false, upsert: true }
  );
  const sequenceProductId =
    'PRD-' + seqProductId.sequenceCounter.toString().padStart(8, '0');
  const product = new Product({
    sequenceProductId,
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: CLOUDINARY_SAMPLE_IMAGE_URL,
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Get top rated products
// @route   GET /api/products/v1/top
// @access  Public
// @req
// @res     status(200).json(products)
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/v1/:id
// @access  Public
// @req     params.id
// @res     status(200).json(product)
//       or status(404).message:'Product ' + req.params.id + ' not found'
const getProductById = asyncHandler(async (req, res) => {
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
//       or status(404).message:'Product not found'
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
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
//       or status(404).message:'Product not found'
const deleteProduct = asyncHandler(async (req, res) => {
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
//       or status(400).message:'Product already reviewed'
//       or status(404).message:'Product not found'
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      throw new ExtendedError('Product already reviewed', 400);
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
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
});

export {
  getProducts,
  createProduct,
  getTopProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
};
