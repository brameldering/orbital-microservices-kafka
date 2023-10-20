import { Response } from 'express';
import jwt from 'jsonwebtoken';

// import { EnvConfigurationError } from '../types/error-types';

const generateToken = (res: Response, jwtUserId: string, jwtEmail: string) => {
  const jwtSecret = process.env.JWT_SECRET!; // Exclamation mark to indicate we are sure this exists coz the check already happened in server.ts
  const expiresIn = process.env.EXPIRES_IN!;
  const cookieExpiresTime = Number(process.env.COOKIE_EXPIRES_TIME!);

  const token = jwt.sign({ jwtUserId, jwtEmail }, jwtSecret, {
    expiresIn,
  });
  console.log('Store JWT in Cookie');
  // Store JWT in an HTTP-Only and secure cookie, which is the most secure option
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: cookieExpiresTime, // numeric in milliseconds
  });
};

export default generateToken;
