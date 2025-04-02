
import { Product } from '../../models/product-model';
import { Listener } from '../../kafka/base-listener';
import { Topics } from '../../kafka/types/topics';
import { InventoryUpdatedEvent } from '../../kafka/types/inventory/inventory-updated-event';
import { ApplicationServerError, ApplicationIntegrityError } from '../../types/error-types';

export class InventoryUpdatedListener extends Listener<InventoryUpdatedEvent> {
  topic: Topics.InventoryUpdated = Topics.InventoryUpdated;

  async onMessage(key: string, data: InventoryUpdatedEvent['data']) {
    try {
      // if (typeof data === 'string') {
      //   data = JSON.parse(data);
      // }
      const { productId, quantity } = data;
      // console.log('productId', productId);
      // console.log('quantity', quantity);

      const product = await Product.findOne({ sequentialProductId: productId });

      // If no product record found, throw error
      if (!product) {
        throw new ApplicationIntegrityError(
          'InventoryUpdatedListener - product record not found'
        );
      }

      // Update the countInStock property
      product.set({ countInStock: quantity });

      // Save the updated product record
      await product.save();
    } catch (error: any) {
      console.error(
        `Error in InventoryUpdatedEvent for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
