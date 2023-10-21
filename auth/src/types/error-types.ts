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

export class RequestValidationError extends CustomError {
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

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super('Not authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}

export class DatabaseError extends CustomError {
  statusCode = 500;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class EnvConfigurationError extends CustomError {
  statusCode = 500;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, EnvConfigurationError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class RouteNoteFoundError extends CustomError {
  statusCode = 404;
  reason = 'Route for this API not found';
  constructor() {
    super('Route for this API not found');
    Object.setPrototypeOf(this, RouteNoteFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
