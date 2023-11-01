import mongoose from 'mongoose';
import {
  ISequenceIdObj,
  ISequenceIdDoc,
  ISequenceIdModel,
} from '@orbitelco/common';

const idSequenceSchema = new mongoose.Schema(
  {
    sequenceName: {
      type: String,
      required: true,
      unique: true,
    },
    sequenceCounter: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

idSequenceSchema.statics.build = (attrs: ISequenceIdObj) => {
  return new IdSequence(attrs);
};

const IdSequence = mongoose.model<ISequenceIdDoc, ISequenceIdModel>(
  'IdSequence',
  idSequenceSchema
);

export { IdSequence };
