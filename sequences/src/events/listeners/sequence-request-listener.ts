import {
  kafkaWrapper,
  Listener,
  Topics,
  Sequence,
  SequenceRequestEvent,
} from '@orbitelco/common';

export class SequenceRequestListener extends Listener<SequenceRequestEvent> {
  topic: Topics.SequenceRequest = Topics.SequenceRequest;

  async onMessage(key: string, data: SequenceRequestEvent['data']) {
    try {
      const { entity, entityObjectId } = data;
      console.log('entity', entity);

      // Perform updateandget in one statement
      const assignedSequence = await Sequence.findOneAndUpdate(
        { entity: entity },
        { $inc: { currentSequence: 1 } },
        { returnOriginal: false, upsert: true }
      );

      // Publish assigned sequence response
      await kafkaWrapper.publishers[Topics.SequenceResponse].publish(entity, {
        entity,
        entityObjectId,
        sequenceNumber: assignedSequence.currentSequence,
      });
    } catch (error: any) {
      console.error(
        `Error in SequenceRequestListener for topic ${this.topic}:`,
        error
      );
    }
  }
}
