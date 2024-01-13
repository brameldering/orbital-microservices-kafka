import {
  Order,
  Listener,
  Topics,
  Entities,
  SequenceResponseOrdersEvent,
  ApplicationServerError,
  ObjectNotFoundError,
} from '@orbital_app/common';

export class SequenceResponseOrdersListener extends Listener<SequenceResponseOrdersEvent> {
  topic: Topics.SequenceResponseOrders = Topics.SequenceResponseOrders;

  async onMessage(key: string, data: SequenceResponseOrdersEvent['data']) {
    const { entityObjectId, sequenceNumber } = data;
    try {
      const order = await Order.findById(entityObjectId);
      if (order) {
        const sequentialOrderId: string =
          'ORD-' + sequenceNumber.toString().padStart(10, '0');

        order.sequentialOrderId = sequentialOrderId;
        await order.save();
      } else {
        throw new ObjectNotFoundError(
          'Error in SequenceResponseListener: Order not found'
        );
      }
    } catch (error: any) {
      console.error(
        `Error in SequenceResponseListener for topic ${this.topic} and entity ${Entities.OrdersEntity}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
