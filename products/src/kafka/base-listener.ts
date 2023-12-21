import { Topics } from './types/topics';

interface Event {
  topic: Topics;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract topic: T['topic'];
  abstract onMessage(data: T['data']): Promise<void>;

  constructor() {}

  parseMessage(message: { value: Buffer | null }) {
    const data = message.value;
    return data ? JSON.parse(data.toString()) : null;
  }
}
