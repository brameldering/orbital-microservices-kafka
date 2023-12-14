import { Topics } from './topics';

export interface ApiAccessCreatedEvent {
  topic: Topics.ApiAccessCreated;
  data: {
    id: string;
    microservice: string;
    apiName: string;
    allowedRoles: string[];
  };
}
