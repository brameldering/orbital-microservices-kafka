class ExtendedError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500; // Default to Internal Server Error
    this.name = this.constructor.name; // Set the error name to the class name
  }
}

const notFound = (req, res, next) => {
  const error = new Error(`API Not Found for: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // if no statusCode provided then set to internal server error
  let statusCode = err.statusCode || 500;
  // if statusCode is still success (2xx) then set statusCode to 500
  statusCode = statusCode >= 200 && statusCode < 300 ? 500 : statusCode;
  let message = err.message || '';

  // MongoDB provides err.code. This is 11000 to indicate dublicate unique field error.
  // Which happens when registering or updating profile to an already existing email address
  if (err.code && err.code === 11000) {
    (statusCode = 422),
      (message = `That ${Object.keys(err.keyValue)} already exists`);
  }

  // TO DO: Log error to Winston

  res.status(statusCode).json({
    message: message,
    stack: err.stack,
  });
};

export { ExtendedError, notFound, errorHandler };
