export interface IConsumerConfig {
  sessionTimeout: number;
  rebalanceTimeout: number;
  heartbeatInterval: number;
  allowAutoTopicCreation: boolean;
}
