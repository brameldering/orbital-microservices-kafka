import express from 'express';

import { protect, admin } from '../middleware/authMiddleware';
import checkObjectId from '../middleware/checkObjectId';

import {
  getProducts,
  createProduct,
  getProductsForIds,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
} from './productController';

const router = express.Router();
router
  .route('/api/products/v1')
  .get(getProducts)
  .post(protect, admin, createProduct);
router.route('/api/products/v1/productsforids').get(getProductsForIds);
router
  .route('/api/products/v1/:id/reviews')
  .post(protect, checkObjectId, createProductReview);
router
  .route('/api/products/v1/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
