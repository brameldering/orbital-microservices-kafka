import {
  Product,
  Listener,
  Topics,
  Entities,
  SequenceResponseProductsEvent,
  ApplicationServerError,
  ObjectNotFoundError,
} from '@orbitelco/common';

export class SequenceResponseProductsListener extends Listener<SequenceResponseProductsEvent> {
  topic: Topics.SequenceResponseProducts = Topics.SequenceResponseProducts;

  async onMessage(key: string, data: SequenceResponseProductsEvent['data']) {
    const { entityObjectId, sequenceNumber } = data;
    try {
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
    } catch (error: any) {
      console.error(
        `Error in SequenceResponseListener for topic ${this.topic} and entity ${Entities.ProductsEntity}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
