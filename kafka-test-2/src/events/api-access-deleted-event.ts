import { Topics } from './topics';

export interface ApiAccessDeletedEvent {
  topic: Topics.ApiAccessDeleted;
  data: {
    id: string;
    // microservice: string;
    // apiName: string;
    // allowedRoles: string[];
  };
}
