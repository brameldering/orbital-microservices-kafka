import jwt from 'jsonwebtoken';
import { ExtendedError } from '../../middleware/errorMiddleware';
import { Response } from 'express';

const generateToken = (res: Response, userId: string) => {
  if (
    !(
      process.env.JWT_SECRET &&
      process.env.EXPIRES_IN &&
      process.env.COOKIE_EXPIRES_TIME &&
      !isNaN(Number(process.env.COOKIE_EXPIRES_TIME))
    )
  ) {
    throw new ExtendedError(
      'Missing settings in .env for JWT_SECRET or EXPIRES_IN or COOKIE_EXPIRES_TIME'
    );
  }

  const token =
    process.env.JWT_SECRET &&
    jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN,
    });

  // Set JWT as an HTTP-Only cookie
  if (process.env.COOKIE_EXPIRES_TIME) {
    const cookieExpiresTime = Number(process.env.COOKIE_EXPIRES_TIME);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: cookieExpiresTime * 24 * 60 * 60 * 1000,
    });
  }
};

export default generateToken;
