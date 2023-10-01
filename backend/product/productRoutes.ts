import express from 'express';
import checkObjectId from '../middleware/checkObjectId';
import { protect, admin } from '../middleware/authMiddleware';
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
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/productsforids').get(getProductsForIds);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

export default router;
