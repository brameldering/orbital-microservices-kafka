import express, { Response, NextFunction } from 'express';
// import { body } from 'express-validator';
import {
  ORDERS_URL,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  ORDERS_APIS,
  Order,
  IOrderAttrs,
  IOrderUser,
  calcPrices,
  IPriceCalcSettingsAttrs,
  UserInputError,
  DatabaseError,
  kafkaWrapper,
  Topics,
  GENERATING,
} from '@orbitelco/common';
import { getPriceCalcSettings } from '../utils/getPriceCalcSettings';

const router = express.Router();

// @desc    Create an order
// @route   POST /api/orders/v2
// @access  Private
// @req     req.currentuser.id
//          body {orderItems, shippingAddress, paymentMethod}
// @res     status(201).(createdOrder)
//       or status(400).json({ message:'No order items' })
router.post(
  ORDERS_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(ORDERS_APIS, req.apiAccessCache || [])(req, res, next),
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Orders']
      #swagger.description = 'Create new order'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
        #swagger.parameters['req.currentUser!.id'] = {
            in: 'request',
            description: 'will automatically be in the request object if the user is logged in',
            required: 'true',
            type: 'string',
        }
      #swagger.parameters['orderItems, shippingAddress, paymentMethod'] = {
          in: 'body',
          description: '{orderItems, shippingAddress, paymentMethod} info of order',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[201] = {
          description: 'json(createdOrder)',
      }
      #swagger.responses[400] = {
          description: 'json({ message: No order items })',
     } */

    const user: IOrderUser = {
      userId: req.currentUser!.id!,
      name: req.currentUser!.name,
      email: req.currentUser!.email,
    };

    const { orderItems, shippingAddress, paymentMethod } = req.body;
    if (!orderItems || (orderItems && orderItems.length === 0)) {
      throw new UserInputError('No order items in request body');
    }
    // else {
    // // get the product info for the orderItems from the database
    // const itemsFromDB: ProductObject[] = await Product.find({
    //   _id: { $in: orderItems.map((x: OrderOrderItem) => x.productId) },
    // });
    // console.log('=== createOrder -> itemsFromDB');
    // console.log(itemsFromDB);
    // // map over the order items and get the price from our items from database
    // const dbOrderItems: OrderOrderItem[] = orderItems.map(
    //   (itemFromClient: OrderOrderItem) => {
    //     const matchingItemFromDB: ProductObject | undefined =
    //       itemsFromDB.find(
    //         (itemFromDB) =>
    //           itemFromDB._id.toString() ===
    //           itemFromClient.productId.toString()
    //       );
    //     return {
    //       ...itemFromClient,
    //       productId: itemFromClient.productId,
    //       price: matchingItemFromDB!.price,
    //       _id: undefined,
    //     };
    //   }
    // );
    // console.log('=== createOrder -> orderItems');
    // console.log(orderItems);

    // Get price calculation settings
    const priceCalcSettings: IPriceCalcSettingsAttrs | null =
      await getPriceCalcSettings();
    // console.log('PriceCalcSettings', priceCalcSettings);
    if (!priceCalcSettings) {
      throw new DatabaseError('Missing Price Calc Settings table in database');
    }
    // calculate prices
    const totalAmounts = calcPrices(
      orderItems,
      priceCalcSettings.vatPercentage,
      priceCalcSettings.shippingFee,
      priceCalcSettings.thresholdFreeShipping
    );
    // console.time('TimeNeededToSaveOrder');
    const sequentialOrderId = GENERATING;
    const orderObj: IOrderAttrs = {
      sequentialOrderId,
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult: {},
      totalAmounts,
      isPaid: false,
      isDelivered: false,
    };

    const order = Order.build(orderObj);
    const savedOrder = await order.save();

    // Request generating sequence number: Publish SequenceRequestOrdersEvent
    await kafkaWrapper.publishers[Topics.SequenceRequestOrders].publish(
      savedOrder._id.toString(),
      {
        entityObjectId: savedOrder._id,
      }
    );

    res.status(201).send(savedOrder.toJSON());
  }
);

export { router as createOrderRouter };
