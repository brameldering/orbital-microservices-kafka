import express, { Response, NextFunction } from 'express';
import {
  UPDATE_ORDER_TO_DELIVERED_URL,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  ORDERS_APIS,
  Order,
  ObjectNotFoundError,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Update the isDelivered flag of an order
// @route   PUT /api/orders/v2/updatetodelivered/:id
// @access  Admin
// @req     params.id
// @res     (updatedOrder)
//       or status(404).ObjectNotFoundError(Order not found)
router.put(
  UPDATE_ORDER_TO_DELIVERED_URL + '/:id',
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(ORDERS_APIS, req.apiAccessCache || [])(req, res, next),
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Orders']
      #swagger.description = 'Update order to delivered.'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'orderId',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
          description: 'json(updatedOrder)',
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Order not found)'
      }
  } */
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date(Date.now());
      const updatedOrder = await order.save();
      res.send(updatedOrder.toJSON());
    } else {
      throw new ObjectNotFoundError('Order not found');
    }
  }
);
export { router as updateOrderToDeliveredRouter };
