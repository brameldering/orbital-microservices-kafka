import { PrismaClient } from '@prisma/client';

import {
  Listener,
  Topics,
  ApiAccessDeletedEvent,
  apiAccessCachePostgres,
  ApplicationIntegrityError,
  ApplicationServerError,
  MICROSERVICE_INVENTORY,
} from '@orbital_app/common';

export class ApiAccessDeletedListener extends Listener<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;
  private _inventoryDB: PrismaClient;

  constructor(inventoryDB: PrismaClient) {
    super();
    this._inventoryDB = inventoryDB;
  }

  async onMessage(key: string, data: ApiAccessDeletedEvent['data']) {
    try {
      const { apiName, microservice } = data;

      // Check that this ApiAccessDeletedEvent is relevant for the Inventory Microservice
      if (microservice === MICROSERVICE_INVENTORY) {
        const apiAccess = await this._inventoryDB.api_access.findUnique({
          where: {
            api_name: apiName,
          },
        });

        // If no apiAccess record found, throw error
        if (!apiAccess) {
          throw new ApplicationIntegrityError(
            'ApiAccessDeletedListener - ApiAccess record not found'
          );
        }

        // Delete the ApiAccess record
        await this._inventoryDB.api_access.delete({
          where: {
            api_name: apiName,
          },
        });

        // Refresh ApiAccesscache
        await apiAccessCachePostgres.loadCacheFromDB(this._inventoryDB);
        console.log('Updated apiAccess');
      }
    } catch (error: any) {
      console.error(
        `Error in ApiAccessDeletedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
