import { Topics } from './topics';

export interface ApiAccessUpdatedEvent {
  topic: Topics.ApiAccessUpdated;
  data: {
    id: string;
    // microservice: string;
    // apiName: string;
    allowedRoles: string[];
  };
}
