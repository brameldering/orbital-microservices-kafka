import mongoose from 'mongoose';
import asyncHandler from '../../general/middleware/asyncHandler.js';
import { ExtendedError } from '../../general/middleware/errorMiddleware.js';
import IdSequence from '../../general/models/idSequenceModel.js';
import Order from '../models/orderModel.js';
import Product from '../../product/models/productModel.js';
import { calcPrices } from '../../general/utils/calcPrices.js';
import {
  verifyPayPalPayment,
  checkIfNewTransaction,
} from '../../general/utils/paypal.js';

// @desc    Get all orders
// @route   GET /api/orders/v1
// @access  Private/Admin
// @req
// @res     status(200).json(orders)
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.status(200).json(orders);
});

// @desc    Create new order
// @route   POST /api/orders/v1
// @access  Private
// @req     user._id
//          body {orderItems, shippingAddress, paymentMethod}
// @res     status(201).json(createdOrder)
//       or status(400).message:'No order items'
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (orderItems && orderItems.length === 0) {
    throw new ExtendedError('No order items', 400);
  } else {
    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x.productId) },
    });
    console.log(itemsFromDB);
    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient.productId
      );
      return {
        ...itemFromClient,
        productId: itemFromClient.productId,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });
    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);
    // console.time('TimeNeededToSaveOrder');
    // Determine next orderId
    const seqNumberOrderId = await IdSequence.findOneAndUpdate(
      { sequenceName: 'sequenceOrderId' },
      { $inc: { sequenceCounter: 1 } },
      { returnOriginal: false, upsert: true }
    );
    const sequenceOrderId =
      'ORD-' + seqNumberOrderId.sequenceCounter.toString().padStart(10, '0');
    const order = new Order({
      sequenceOrderId: sequenceOrderId,
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    // console.timeEnd('TimeNeededToSaveOrder');
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/v1/mine/:id
// @access  Private
// @req     params.id
// @res     status(200).json(orders)
const getMyOrders = asyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const orders = await Order.find({ user: id });
  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/v1/:id
// @access  Private
// @req     params.id
// @res     status(200).json(order)
//       or status(404).message:'Order not found'
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    res.status(200).json(order);
  } else {
    throw new ExtendedError('Order not found', 404);
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/v1/:id/pay
// @access  Private
// @req     params.id
//          body {id, status, update_time, payer.email_address}
// @res     status(200).json(updatedOrder)
//       or status(404).message:'Order not found'
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // NOTE: here we need to verify the payment was made to PayPal before marking
  // the order as paid
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new ExtendedError('Payment not verified');
  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) {
    throw new ExtendedError('Transaction has been used before');
  }
  const order = await Order.findById(req.params.id);
  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new ExtendedError('Incorrect amount paid');
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    throw new ExtendedError('Order not found', 404);
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/v1/:id/deliver
// @access  Private/Admin
// @req     params.id
// @res     status(200).json(updatedOrder)
//       or status(404).message:'Order not found'
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    throw new ExtendedError('Order not found', 404);
  }
});

export {
  getOrders,
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
};
