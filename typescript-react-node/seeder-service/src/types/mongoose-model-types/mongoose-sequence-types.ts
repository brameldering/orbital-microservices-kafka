import mongoose from 'mongoose';

// Interface describing the sequence object attributes
export interface ISequenceAttrs {
  id?: string;
  entity: string;
  currentSequence: number;
}

// Interface describing the sequence Model
export interface ISequenceModel extends mongoose.Model<ISequenceDoc> {
  build(attrs: ISequenceAttrs): ISequenceDoc;
}

// Interface describing the sequence Document
export interface ISequenceDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  entity: string;
  currentSequence: number;
  createdAt?: Date;
  updatedAt?: Date;
}
