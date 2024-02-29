import { PrismaClient } from '@prisma/client';
import {
  Listener,
  Topics,
  ApiAccessCreatedEvent,
  apiAccessCachePostgres,
  ApplicationServerError,
  MICROSERVICE_INVENTORY,
} from '@orbital_app/common';

export class ApiAccessCreatedListener extends Listener<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;
  private _inventoryDB: PrismaClient;

  constructor(inventoryDB: PrismaClient) {
    super();
    this._inventoryDB = inventoryDB;
  }

  async onMessage(key: string, data: ApiAccessCreatedEvent['data']) {
    try {
      const { apiName, microservice } = data;
      // allowedRoles

      // Check that this ApiAccessCreatedEvent is relevant for the Inventory Microservice
      if (microservice === MICROSERVICE_INVENTORY) {
        await this._inventoryDB.api_access.create({
          data: {
            api_name: apiName,
            microservice: microservice,
            // To do include allowed_roles
          },
        });

        // Refresh ApiAccess cache
        await apiAccessCachePostgres.loadCacheFromDB(this._inventoryDB);
        console.log('Updated apiAccess');
      }
    } catch (error: any) {
      console.error(
        `Error in ApiAccessCreatedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
