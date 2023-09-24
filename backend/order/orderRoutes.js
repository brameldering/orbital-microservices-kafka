import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from './orderController.js';

const router = express.Router();
router.route('/').get(protect, admin, getOrders).post(protect, createOrder);
router.route('/mine/:id').get(protect, checkObjectId, getMyOrders);
router.route('/:id').get(protect, checkObjectId, getOrderById);
router.route('/:id/pay').put(protect, checkObjectId, updateOrderToPaid);
router
  .route('/:id/deliver')
  .put(protect, admin, checkObjectId, updateOrderToDelivered);

export default router;
