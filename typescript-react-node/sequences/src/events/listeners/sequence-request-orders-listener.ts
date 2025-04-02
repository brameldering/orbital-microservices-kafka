import { Sequence } from '../../models/sequence-model';
import { kafkaWrapper } from '../../kafka/kafka-wrapper';
import { Listener } from '../../kafka/base-listener';
import { Topics } from '../../kafka/types/topics';
import { SequenceRequestOrdersEvent } from '../../kafka/types/sequence/sequence-request-orders-event';
import { Entities } from '../../kafka/types/sequence/entity-types';

export class SequenceRequestOrdersListener extends Listener<SequenceRequestOrdersEvent> {
  topic: Topics.SequenceRequestOrders = Topics.SequenceRequestOrders;

  async onMessage(key: string, data: SequenceRequestOrdersEvent['data']) {
    try {
      const { entityObjectId } = data;

      // Perform updateandget in one statement
      const assignedSequence = await Sequence.findOneAndUpdate(
        { entity: Entities.OrdersEntity },
        { $inc: { currentSequence: 1 } },
        { returnOriginal: false, upsert: true }
      );

      // Publish assigned sequence response
      await kafkaWrapper.publishers[Topics.SequenceResponseOrders].publish(
        entityObjectId,
        {
          entityObjectId,
          sequenceNumber: assignedSequence.currentSequence,
        }
      );
    } catch (error: any) {
      console.error(
        `Error in SequenceRequestOrdersListener for topic ${this.topic}:`,
        error
      );
    }
  }
}
