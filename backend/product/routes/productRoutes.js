import express from 'express';
import checkObjectId from '../../general/middleware/checkObjectId.js';
import { protect, admin } from '../../general/middleware/authMiddleware.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productController.js';

const router = express.Router();
router.route('/').get(getProducts).post(protect, admin, createProduct);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

export default router;
