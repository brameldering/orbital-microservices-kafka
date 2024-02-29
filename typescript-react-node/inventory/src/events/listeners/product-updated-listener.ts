import { PrismaClient } from '@prisma/client';
import {
  Listener,
  Topics,
  ProductUpdatedEvent,
  ApplicationIntegrityError,
  ApplicationServerError,
} from '@orbital_app/common';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  topic: Topics.ProductUpdated = Topics.ProductUpdated;
  private _inventoryDB: PrismaClient;

  constructor(inventoryDB: PrismaClient) {
    super();
    this._inventoryDB = inventoryDB;
  }

  async onMessage(key: string, data: ProductUpdatedEvent['data']) {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      const { productId, name, brand, category } = data;
      // console.log('productId', productId);
      // console.log('quantity', quantity);

      const product = await this._inventoryDB.product_inventory.findUnique({
        where: {
          product_id: productId,
        },
      });

      // If no product record found, throw error
      if (!product) {
        throw new ApplicationIntegrityError(
          'ProductUpdatedListener - product record not found'
        );
      }

      product.name = name;
      product.brand = brand;
      product.category = category;

      const updatedProduct = await this._inventoryDB.product_inventory.update({
        where: {
          product_id: productId,
        },
        data: {
          name: product.name,
          brand: product.brand,
          category: product.category,
        },
      });
      console.log('Product updated:', updatedProduct);
    } catch (error: any) {
      console.error(
        `Error in ProductUpdatedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
