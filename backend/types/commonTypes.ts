import { Request } from 'express';
import mongoose from 'mongoose';

export interface IExtendedRequest extends Request {
  user?: IReqUser;
}

export interface IReqUser {
  _id?: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDecodedJWTVerify {
  userId: string;
  iat: string;
  exp: string;
}

export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ITotalAmounts {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}
