import { Request, Response, NextFunction } from 'express';

// Extend Error class with default status of 500
class ExtendedError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    // Because we are extending a built in class
    Object.setPrototypeOf(this, ExtendedError.prototype);
  }
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ExtendedError(`API Not Found for: ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction // This is needed even though ESLint may complain
) => {
  // if no status provided then set to internal server error
  let status = err.status || 500;
  // if status is still success (2xx) then set status to 500
  status = status >= 200 && status < 300 ? 500 : status;
  let message = err.message || '';

  // MongoDB provides err.code. This is 11000 to indicate dublicate unique field error.
  // Which happens when registering or updating profile to an already existing email address
  if (err?.code === 11000) {
    (status = 422),
      (message = `That ${Object.keys(err.keyValue)} already exists`);
  }

  // TO DO: Log error to Winston
  console.log('=== errorMiddleware' + message);

  res.status(status).json({
    message: message,
    stack: err.stack,
  });
  next();
};

export { ExtendedError, notFound, errorHandler };
