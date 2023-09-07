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
  getTopProducts,
} from '../controllers/productController.js';

const router = express.Router();
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts); // this needs to be before the /:id otherwise it will use the /:id route
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
// router.route('/:id/image').patch(protect, checkObjectId, updateProductImage);

export default router;
