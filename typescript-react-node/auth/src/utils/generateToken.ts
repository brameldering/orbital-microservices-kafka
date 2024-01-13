import { Request } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

if (process.env?.NODE_ENV === 'test') {
  // WIll be used in test environment
  dotenv.config();
}
// import { EnvConfigurationError } from '@orbital_app/common';

const generateToken = (
  req: Request,
  id: string,
  name: string,
  email: string,
  role: string
) => {
  const jwtSecret = process.env.JWT_SECRET!; // Exclamation mark to indicate we are sure this exists coz the check already happened in server.ts
  const expiresIn = process.env.EXPIRES_IN!;
  // const cookieExpiresTime = Number(process.env.COOKIE_EXPIRES_TIME!);

  const token = jwt.sign({ id, name, email, role }, jwtSecret, {
    expiresIn,
  });
  // Store it on session object
  req.session = {
    jwt: token,
  };
  // Store JWT in an HTTP-Only and secure cookie, which is the most secure option
  // res.cookie('jwt', token, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'strict', // Prevent CSRF attacks
  //   maxAge: cookieExpiresTime, // numeric in milliseconds
  // });
};

export default generateToken;
