const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode >= 200 || res.statusCode < 300 ? 500 : res.statusCode;
  let errorCode = err.code || 0;
  let message = err.message || '';

  // Handle dublicate unique field error such as register or profile update
  // to an already existing email address
  if (errorCode === 11000) {
    message = `A user with that ${Object.keys(err.keyValue)} already exists`;
  }

  // NOTE: checking for invalid ObjectId moved to it's own middleware
  // See README for further info.

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
