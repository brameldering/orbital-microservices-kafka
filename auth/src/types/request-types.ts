import { Request } from 'express';

export interface IExtendedRequest extends Request {
  currentUser?: IReqUser;
}

export interface IReqUser {
  id: string;
  name: string;
  email: string;
}

export interface IDecodedJWTVerify {
  userId: string;
  email: string;
  iat: string;
  exp: string;
}
