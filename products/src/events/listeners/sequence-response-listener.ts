import {
  Product,
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
      // Only process events for ProductsEntity
      if (entity === Entities.ProductsEntity) {
        const product = await Product.findById(entityObjectId);
        if (product) {
          const sequentialProductId: string =
            'PRD-' + sequenceNumber.toString().padStart(10, '0');

          product.sequentialProductId = sequentialProductId;
          await product.save();
        } else {
          throw new ObjectNotFoundError(
            'Error in SequenceResponseListener: Product not found'
          );
        }
      }
    } catch (error: any) {
      console.error(
        `Error in SequenceResponseListener for topic ${this.topic} and entity ${Entities.ProductsEntity}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
