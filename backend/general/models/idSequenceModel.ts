import mongoose from 'mongoose';
import {
  IdSequenceModel,
  IdSequenceSchema,
  IdSequenceDocument,
} from 'types/mongoose.gen';

const idSequenceSchema: IdSequenceSchema = new mongoose.Schema({
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
});

const IdSequence = mongoose.model<IdSequenceDocument, IdSequenceModel>(
  'IdSequence',
  idSequenceSchema
);

export default IdSequence;
