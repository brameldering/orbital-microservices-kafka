import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import {
  MY_ORDERS_URL,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  ORDERS_APIS,
  Order,
} from '@orbital_app/common';

const router = express.Router();

// @desc    Fetch orders belonging to currently logged in user
// @route   GET /api/orders/v2/mine
// @access  Private
// @req     req.currentUser!.id
// @res     json(orders)
router.get(
  MY_ORDERS_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(ORDERS_APIS, req.apiAccessCache || [])(req, res, next),
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Orders']
      #swagger.description = 'Fetch orders belonging to currently logged in user'
         #swagger.parameters['req.currentUser!.id'] = {
            in: 'request',
            description: 'will automatically be in the request object if the user is logged in',
            required: 'true',
            type: 'string',
        }
      #swagger.responses[200] = {
            description: 'orders belonging to logged in user'
      }
} */
    const userId = new mongoose.Types.ObjectId(req.currentUser!.id);
    const ordersOriginal = await Order.find({ 'user.userId': userId });
    // .populate('user', 'name email')
    // .exec();
    // map products to json format as defined in product-types productSchema
    const orders = ordersOriginal.map((order: { toJSON: () => any }) =>
      order.toJSON()
    );
    res.send(orders);
  }
);

export { router as getMyOrdersRouter };
