import express from 'express';

import { protect, admin } from '../middleware/authMiddleware';
import checkObjectId from '../middleware/checkObjectId';

import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  calcTotalAmounts,
} from './orderController';

const router = express.Router();
router
  .route('/api/orders/v1/')
  .get(protect, admin, getOrders)
  .post(protect, createOrder);
router.route('/api/orders/v1/totals').post(calcTotalAmounts);
router
  .route('/api/orders/v1/mine/:id')
  .get(protect, checkObjectId, getMyOrders);
router.route('/api/orders/v1/:id').get(protect, checkObjectId, getOrderById);
router
  .route('/api/orders/v1/:id/pay')
  .put(protect, checkObjectId, updateOrderToPaid);
router
  .route('/api/orders/v1/:id/deliver')
  .put(protect, admin, checkObjectId, updateOrderToDelivered);

export default router;
