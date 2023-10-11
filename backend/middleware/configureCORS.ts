import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { Express } from 'express';

import { ExtendedError } from './errorMiddleware';

const configureCORS = (app: Express) => {
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
  if (!allowedOrigins) {
    throw new ExtendedError('Missing setting in .env for CORS_ALLOWED_ORIGINS');
  }
  app.use(
    cors({
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new ExtendedError(msg), false);
        }
        return callback(null, true);
      },
      exposedHeaders: ['Content-Length', 'Origin', 'Accept'],
      credentials: true,
    })
  );
  // Error handler middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ExtendedError) {
      console.log('Error with message: ' + err.message);
      res.status(403).json({
        message: err.message,
        stack: err.stack,
      });
    } else {
      // Pass other errors to the default error handler
      next(err);
    }
  });
};

// const configureCORS = (req: Request, res: Response, next: NextFunction) => {
//   const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
//   // const origin: string | undefined = req.headers.origin;

//   if (!allowedOrigins) {
//     throw new ExtendedError('Missing setting in .env for CORS_ALLOWED_ORIGINS');
//   }

//   res.header('Access-Control-Allow-Origin', allowedOrigins);
//   res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
//   res.header(
//     'Access-Control-Allow-Methods',
//     'POST, GET, PUT, PATCH, DELETE, OPTIONS'
//   );
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// };

export default configureCORS;
