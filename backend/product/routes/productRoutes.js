import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../../general/middleware/authMiddleware.js';
import checkObjectId from '../../general/middleware/checkObjectId.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts); // this needs to be before the /:id otherwise it will use the /;id route
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

export default router;
