import {
  kafkaWrapper,
  Listener,
  Topics,
  Sequence,
  SequenceRequestOrdersEvent,
  Entities,
} from '@orbitelco/common';

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
