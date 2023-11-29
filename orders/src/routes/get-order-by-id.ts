import express, { Request, Response } from 'express';
import { ORDERS_URL, Order, ObjectNotFoundError } from '@orbitelco/common';

const router = express.Router();

// @desc    Fetch order by ID
// @route   GET /api/orders/v2/:id
// @access  Private
// @req     params.id
// @res     json(order)
//       or status(404).ObjectNotFoundError(Order not found)
router.get(ORDERS_URL + '/:id', async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Orders']
      #swagger.description = 'Fetch single order by OrderID'
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'json(order): order id of the order to get',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
            description: 'Corresponding order'
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Order not found)'
      }
} */
  const order = await Order.findById(req.params.id);
  // .populate('user', 'name email')
  // .exec();
  if (order) {
    res.send(order.toJSON());
  } else {
    throw new ObjectNotFoundError('Order not found');
  }
});

export { router as getOrderByIdRouter };
