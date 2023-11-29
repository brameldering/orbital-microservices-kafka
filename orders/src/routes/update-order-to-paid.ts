import express, { Request, Response } from 'express';
import {
  UPDATE_ORDER_TO_PAID_URL,
  Order,
  UserInputError,
  ObjectNotFoundError,
} from '@orbitelco/common';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal';

const router = express.Router();

// @desc    Update the isPaid flag of an order
// @route   PUT /api/orders/v2/updatetopaid/:id
// @access  Private
// @req     params.id
//          body {id, status, update_time, payer.email_address}
// @res     (updatedOrder)
//       or status(404).ObjectNotFoundError(Order not found)
router.put(
  UPDATE_ORDER_TO_PAID_URL + '/:id',
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Orders']
      #swagger.description = 'Update order to paid.  Verifies that correct payment has been made using PayPal'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'orderId',
            required: 'true',
            type: 'string'
      }
      #swagger.parameters['Payment'] = {
            in: 'body',
            description: 'Payment Result object: {id, status, update_time, payer.email_address}',
            required: 'true',
            type: 'object',
      }
      #swagger.responses[200] = {
          description: 'json(updatedOrder)',
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Order not found)'
      }
  } */
    // Verify the payment was made to PayPal before marking the order as paid
    // console.log('= updateOrderToPaid ==============================');
    const { verified, value } = await verifyPayPalPayment(req.body.id);
    if (!verified) throw new UserInputError('Payment not verified');
    // check if this transaction has been used before
    const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
    if (!isNewTransaction) {
      throw new UserInputError('Transaction has been used before');
    }
    const order = await Order.findById(req.params.id);
    if (order?.totalAmounts) {
      // check the correct amount was paid
      const paidCorrectAmount = order.totalAmounts.totalPrice === Number(value);
      if (!paidCorrectAmount) throw new UserInputError('Incorrect amount paid');
      order.isPaid = true;
      order.paidAt = new Date(Date.now());
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
      const updatedOrder = await order.save();
      res.send(updatedOrder.toJSON());
    } else {
      throw new ObjectNotFoundError('Order not found');
    }
  }
);
export { router as updateOrderToPaidRouter };
