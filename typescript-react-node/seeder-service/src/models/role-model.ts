import mongoose from 'mongoose';
import {
  IRoleAttrs,
  IRoleDoc,
  IRoleModel,
} from '../types/mongoose-model-types/mongoose-access-types';

// ====================== Roles ======================
const roleSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, unique: true },
    roleDisplay: { type: String, required: true, unique: true },
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

roleSchema.statics.build = (attrs: IRoleAttrs) => {
  return new Role(attrs);
};

const Role = mongoose.model<IRoleDoc, IRoleModel>('Role', roleSchema);

export { Role, roleSchema };
