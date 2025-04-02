import { Request } from 'express';
import { IUserAttrs } from './mongoose-model-types/mongoose-user-types';

export interface IExtendedRequest extends Request {
  currentUser?: IUserAttrs;
}

// export interface IDecodedJWTVerify {
//   userId: string;
//   email: string;
//   iat: string;
//   exp: string;
// }
