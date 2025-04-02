import mongoose from 'mongoose';

// ============================== Roles ==============================
// Interface describing the Role object attributes
export interface IRoleAttrs {
  role: string;
  roleDisplay: string;
}

// Interface describing the Role Model
export interface IRoleModel extends mongoose.Model<IRoleDoc> {
  build(attrs: IRoleAttrs): IRoleDoc;
}

// Interface describing the Role Document
export interface IRoleDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  role: string;
  roleDisplay: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ========================= Api Access =========================
// Interface describing the Api Access object attributes
export interface IApiAccessAttrs {
  id?: string;
  apiName: string;
  microservice: string;
  allowedRoles: string[];
}

// Interface describing the Api Access Model
export interface IApiAccessModel extends mongoose.Model<IApiAccessDoc> {
  build(attrs: IApiAccessAttrs): IApiAccessDoc;
}

// Interface describing the Api Access Document
export interface IApiAccessDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  apiName: string;
  microservice: string;
  allowedRoles: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
