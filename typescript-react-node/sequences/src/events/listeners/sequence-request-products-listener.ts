import { Sequence } from '../../models/sequence-model';
import { kafkaWrapper } from '../../kafka/kafka-wrapper';
import { Listener } from '../../kafka/base-listener';
import { Topics } from '../../kafka/types/topics';
import { SequenceRequestProductsEvent } from '../../kafka/types/sequence/sequence-request-products-event';
import { Entities } from '../../kafka/types/sequence/entity-types';

export class SequenceRequestProductsListener extends Listener<SequenceRequestProductsEvent> {
  topic: Topics.SequenceRequestProducts = Topics.SequenceRequestProducts;

  async onMessage(key: string, data: SequenceRequestProductsEvent['data']) {
    try {
      const { entityObjectId } = data;

      // Perform updateandget in one statement
      const assignedSequence = await Sequence.findOneAndUpdate(
        { entity: Entities.ProductsEntity },
        { $inc: { currentSequence: 1 } },
        { returnOriginal: false, upsert: true }
      );

      // Publish assigned sequence response
      await kafkaWrapper.publishers[Topics.SequenceResponseProducts].publish(
        entityObjectId,
        {
          entityObjectId,
          sequenceNumber: assignedSequence.currentSequence,
        }
      );
    } catch (error: any) {
      console.error(
        `Error in SequenceRequestProductsListener for topic ${this.topic}:`,
        error
      );
    }
  }
}
