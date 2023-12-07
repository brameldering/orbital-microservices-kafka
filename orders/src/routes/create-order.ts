import express, { Response } from 'express';
// import { body } from 'express-validator';
import { calcPrices } from '../utils/calcPrices';
import {
  ORDERS_URL,
  Order,
  OrderSequence,
  IOrderObj,
  IOrderUser,
  IExtendedRequest,
  UserInputError,
  DatabaseError,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Create an order
// @route   POST /api/orders/v2
// @access  Private
// @req     req.currentuser.id
//          body {orderItems, shippingAddress, paymentMethod}
// @res     status(201).(createdOrder)
//       or status(400).json({ message:'No order items' })
router.post(ORDERS_URL, async (req: IExtendedRequest, res: Response) => {
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
  // calculate prices
  const totalAmounts = calcPrices(orderItems);
  // console.time('TimeNeededToSaveOrder');
  // Determine next orderId
  const seqNumberOrderId = await OrderSequence.findOneAndUpdate(
    {},
    { $inc: { latestSeqId: 1 } },
    { returnOriginal: false, upsert: true }
  );
  if (seqNumberOrderId) {
    // console.log('seqNumberOrderId', seqNumberOrderId);
    // console.log('seqNumberOrderId.latestSeqId', seqNumberOrderId.latestSeqId);
    const sequentialOrderId: string =
      'ORD-' + seqNumberOrderId.latestSeqId.toString().padStart(10, '0');
    const orderObj: IOrderObj = {
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
    await order.save();
    res.status(201).send(order.toJSON());
  } else {
    throw new DatabaseError('Error determining sequential Order Id');
    // console.log("Log error details")
  }
});

export { router as createOrderRouter };
