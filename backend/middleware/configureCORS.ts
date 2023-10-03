import { Request, Response, NextFunction } from 'express';

import { ExtendedError } from './errorMiddleware';

const configureCORS = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
  const origin: string | undefined = req.headers.origin;

  if (!allowedOrigins) {
    throw new ExtendedError(
      'Error: missing setting in .env for CORS_ALLOWED_ORIGINS'
    );
  }
  if (!origin) {
    throw new ExtendedError(
      'Error: problem in request headers, missing origin'
    );
  }

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', allowedOrigins);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  res.header(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

export default configureCORS;
