import { PrismaClient } from '@prisma/client';
import {
  Listener,
  Topics,
  ProductCreatedEvent,
  ApplicationIntegrityError,
  ApplicationServerError,
} from '@orbital_app/common';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  topic: Topics.ProductCreated = Topics.ProductCreated;
  private _inventoryDB: PrismaClient;

  constructor(inventoryDB: PrismaClient) {
    super();
    this._inventoryDB = inventoryDB;
  }

  async onMessage(key: string, data: ProductCreatedEvent['data']) {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      const { productId, name, brand, category } = data;
      // console.log('productId', productId);
      // console.log('quantity', quantity);

      // Check if the product already exists
      const existingProduct =
        await this._inventoryDB.product_inventory.findUnique({
          where: {
            product_id: productId,
          },
        });

      if (existingProduct) {
        throw new ApplicationIntegrityError(
          'ProductCreatedListener - product record already exists'
        );
      }

      // Create the product
      const createdProduct = await this._inventoryDB.product_inventory.create({
        data: {
          product_id: productId,
          name,
          brand,
          category,
        },
      });

      console.log('Product created:', createdProduct);
    } catch (error: any) {
      console.error(
        `Error in ProductCreatedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
