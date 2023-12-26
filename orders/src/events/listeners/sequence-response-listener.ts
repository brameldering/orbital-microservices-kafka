import {
  Order,
  Listener,
  Topics,
  Entities,
  SequenceResponseEvent,
  ApplicationServerError,
  ObjectNotFoundError,
} from '@orbitelco/common';

export class SequenceResponseListener extends Listener<SequenceResponseEvent> {
  topic: Topics.SequenceResponse = Topics.SequenceResponse;

  async onMessage(key: string, data: SequenceResponseEvent['data']) {
    const { entity, entityObjectId, sequenceNumber } = data;
    try {
      // Only process events for OrdersEntity
      if (entity === Entities.OrdersEntity) {
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
