import mongoose from 'mongoose';
import {
  ISequenceAttrs,
  ISequenceDoc,
  ISequenceModel,
} from '../types/mongoose-model-types/mongoose-sequence-types';

// ====================== Roles ======================
const sequenceSchema = new mongoose.Schema(
  {
    entity: { type: String, required: true, unique: true },
    currentSequence: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

sequenceSchema.statics.build = (attrs: ISequenceAttrs) => {
  return new Sequence(attrs);
};

const Sequence = mongoose.model<ISequenceDoc, ISequenceModel>(
  'Sequence',
  sequenceSchema
);

export { Sequence, sequenceSchema };
