import { PrismaClient } from '@prisma/client';
import {
  Listener,
  Topics,
  ApiAccessUpdatedEvent,
  apiAccessCachePostgres,
  ApplicationIntegrityError,
  ApplicationServerError,
  IApiAccessRolePostgres,
  MICROSERVICE_INVENTORY,
} from '@orbital_app/common';

export class ApiAccessUpdatedListener extends Listener<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;
  private _inventoryDB: PrismaClient;

  constructor(inventoryDB: PrismaClient) {
    super();
    this._inventoryDB = inventoryDB;
  }

  async onMessage(key: string, data: ApiAccessUpdatedEvent['data']) {
    try {
      const { apiName, microservice, allowedRoles } = data;

      // Check that this ApiAccessUpdatedEvent is relevant for the Inventory Microservice
      if (microservice === MICROSERVICE_INVENTORY) {
        const existingApiAccess = await this._inventoryDB.api_access.findUnique(
          {
            where: {
              api_name: apiName,
            },
          }
        );

        // If no apiAccess record found, throw error
        if (!existingApiAccess) {
          throw new ApplicationIntegrityError(
            'ApiAccessUpdatedListener - ApiAccess record not found'
          );
        }

        // Find existing api_access_role records for the specified apiName
        const existingApiAccessRoles =
          await this._inventoryDB.api_access_role.findMany({
            where: {
              api_access_name: apiName,
            },
          });

        // Extract existing role names from the existingApiAccessRoles
        const existingRoles = existingApiAccessRoles.map(
          (apiAccessRole: IApiAccessRolePostgres) => apiAccessRole.role_id
        );

        // Find roles to disconnect (present in existingRoles but not in allowedRoles)
        const rolesToDisconnect = existingRoles.filter(
          (role_id: string) => !allowedRoles.includes(role_id)
        );

        // Find roles to connect (present in allowedRoles but not in existingRoles)
        const rolesToConnect = allowedRoles.filter(
          (role_id: string) => !existingRoles.includes(role_id)
        );

        // Disconnect roles
        await Promise.all(
          rolesToDisconnect.map((role_id: string) =>
            this._inventoryDB.api_access_role.deleteMany({
              where: {
                api_access_name: apiName,
                role_id: role_id,
              },
            })
          )
        );

        // Connect new roles
        await Promise.all(
          rolesToConnect.map((role_id: string) =>
            this._inventoryDB.api_access_role.create({
              data: {
                api_access_name: apiName,
                role_id: role_id,
              },
            })
          )
        );

        console.log('ApiAccess record updated:', apiName);

        // Refresh ApiAccessArray cache
        await apiAccessCachePostgres.loadCacheFromDB(this._inventoryDB);
        console.log('Updated apiAccess');
      }
    } catch (error: any) {
      console.error(
        `Error in ApiAccessUpdatedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
