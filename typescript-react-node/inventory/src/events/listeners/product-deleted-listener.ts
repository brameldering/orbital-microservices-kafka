import { PrismaClient } from '@prisma/client';
import {
  Listener,
  Topics,
  ProductDeletedEvent,
  ApplicationIntegrityError,
  ApplicationServerError,
} from '@orbital_app/common';

export class ProductDeletedListener extends Listener<ProductDeletedEvent> {
  topic: Topics.ProductDeleted = Topics.ProductDeleted;
  private _inventoryDB: PrismaClient;

  constructor(inventoryDB: PrismaClient) {
    super();
    this._inventoryDB = inventoryDB;
  }

  async onMessage(key: string, data: ProductDeletedEvent['data']) {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      const { productId } = data;
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
          'ProductDeletedListener - product record not found'
        );
      }

      await this._inventoryDB.product_inventory.delete({
        where: {
          product_id: productId,
        },
      });
      console.log('Product deleted:', productId);
    } catch (error: any) {
      console.error(
        `Error in ProductDeletedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
