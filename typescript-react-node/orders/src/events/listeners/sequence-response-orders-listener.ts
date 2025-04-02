import { Order } from '../../models/order-model'
import { Listener } from '../../kafka/base-listener';
import { Topics } from '../../kafka/types/topics';
import { Entities } from '../../kafka/types/sequence/entity-types';
import { SequenceResponseOrdersEvent } from '../../kafka/types/sequence/sequence-response-orders-event';
import { ApplicationServerError, ObjectNotFoundError } from '../../types/error-types';

export class SequenceResponseOrdersListener extends Listener<SequenceResponseOrdersEvent> {
  topic: Topics.SequenceResponseOrders = Topics.SequenceResponseOrders;

  async onMessage(key: string, data: SequenceResponseOrdersEvent['data']) {
    const { entityObjectId, sequenceNumber } = data;
    try {
      const order = await Order.findById(entityObjectId);
      if (order) {
        order.sequentialOrderId = 'ORD-' + sequenceNumber.toString().padStart(10, '0');;
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
