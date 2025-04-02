import { Entities } from '../src/kafka/types/sequence/entity-types';

export const sequences = [
  {
    entity: Entities.ProductsEntity,
    currentSequence: 6,
  },
  // {
  //   entity: 'customers',
  //   currentSequence: 0,
  // },
  {
    entity: Entities.OrdersEntity,
    currentSequence: 0,
  },
];
