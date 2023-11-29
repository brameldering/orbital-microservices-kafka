import express, { Request, Response } from 'express';
import { ORDERS_URL, Order } from '@orbitelco/common';

const router = express.Router();

// @desc    Fetch all orders
// @route   GET /api/orders/v2
// @access  Admin
// @req
// @res     json(orders)
router.get(ORDERS_URL, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Orders']
      #swagger.description = 'Fetch all products'
          #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.responses[200] = {
          description: 'json(orders)',
      }
 */
  const ordersOriginal = await Order.find({});
  // .populate('user', 'name email')
  // .exec();
  // map products to json format as defined in product-types productSchema
  const orders = ordersOriginal.map((order: { toJSON: () => any }) =>
    order.toJSON()
  );
  res.send(orders);
});

export { router as getOrdersRouter };
