import { ValidationError } from 'express-validator';

export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    // Because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}

// Following error is thrown when a problem in code config is detected
class ApplicationIntegrityError extends CustomError {
  statusCode = 500;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ApplicationIntegrityError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

// Following error is thrown when a non specific server error occurs
class ApplicationServerError extends CustomError {
  statusCode = 500;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ApplicationServerError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

class DatabaseError extends CustomError {
  statusCode = 500;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

class EnvConfigurationError extends CustomError {
  statusCode = 500;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, EnvConfigurationError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

// Following error is thrown when a problem with an external API such as PayPal
class ExternalAPIError extends CustomError {
  statusCode = 500;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ExternalAPIError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

class FileUploadError extends CustomError {
  statusCode = 415;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, FileUploadError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

class NotAuthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}

class ObjectNotFoundError extends CustomError {
  statusCode = 404;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');
    // Because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
}
class RouteNotFoundError extends CustomError {
  statusCode = 404;
  reason = 'Route for this API not found';
  constructor() {
    super('Route for this API not found');
    Object.setPrototypeOf(this, RouteNotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}

class UserInputError extends CustomError {
  statusCode = 400;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UserInputError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

export {
  ApplicationIntegrityError,
  ApplicationServerError,
  DatabaseError,
  EnvConfigurationError,
  ExternalAPIError,
  FileUploadError,
  NotAuthorizedError,
  ObjectNotFoundError,
  RequestValidationError,
  RouteNotFoundError,
  UserInputError,
};
