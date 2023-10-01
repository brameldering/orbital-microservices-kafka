import mongoose from 'mongoose';

const idSequenceSchema = new mongoose.Schema({
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

const IdSequence = mongoose.model('IdSequence', idSequenceSchema);

export default IdSequence;
