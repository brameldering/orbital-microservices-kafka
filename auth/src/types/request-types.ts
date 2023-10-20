import { Request } from 'express';
import mongoose from 'mongoose';

export interface IExtendedRequest extends Request {
  user?: IReqUser;
}

export interface IReqUser {
  id?: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDecodedJWTVerify {
  userId: string;
  email: string;
  iat: string;
  exp: string;
}
