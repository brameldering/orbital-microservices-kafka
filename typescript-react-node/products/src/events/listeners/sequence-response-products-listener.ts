import { Entities } from '../../kafka/types/sequence/entity-types';
import { Product } from '../../models/product-model';
import { kafkaWrapper} from "../../kafka/kafka-wrapper";
import { Listener } from '../../kafka/base-listener';
import { Topics } from '../../kafka/types/topics';
import { SequenceResponseProductsEvent } from '../../kafka/types/sequence/sequence-response-products-event';
import { ApplicationServerError, ObjectNotFoundError } from '../../types/error-types';

export class SequenceResponseProductsListener extends Listener<SequenceResponseProductsEvent> {
  topic: Topics.SequenceResponseProducts = Topics.SequenceResponseProducts;

  async onMessage(key: string, data: SequenceResponseProductsEvent['data']) {
    const { entityObjectId, sequenceNumber } = data;
    try {
      const product = await Product.findById(entityObjectId);

      if (product) {
        product.sequentialProductId =  'PRD-' + sequenceNumber.toString().padStart(10, '0');;
        await product.save();

        // Post created product on kafka
        await kafkaWrapper.publishers[Topics.ProductCreated].publish(
          product._id.toString(),
          {
            id: product._id,
            productId: product.sequentialProductId,
            name: product.name,
            brand: product.brand,
            category: product.category,
          }
        );
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
