import { HttpException } from "./http-exception.utils";

// BadRequestException: Invalid input or missing required data
export class BadRequestException extends HttpException {
  constructor(message: string, public error?: Object) {
    super(message, 400, error);
  }
}

// ConflictException: Resource already exists (e.g., duplicate email on signup)
export class ConflictException extends HttpException {
  constructor(message: string, public error?: Object) {
    super(message, 409, error);
  }
}

// NotFoundException: Resource not found (e.g., user or item does not exist)
export class NotFoundException extends HttpException {
  constructor(message: string, public error?: Object) {
    super(message, 404, error);
  }
}

// UnauthorizedException: Invalid credentials or not authenticated
export class UnauthorizedException extends HttpException {
  constructor(message: string, public error?: Object) {
    super(message, 401, error);
  }
}

// TooManyRequestsException: Rate limiting (e.g., too many login attempts)
export class TooManyRequestsException extends HttpException {
  constructor(message: string, public error?: Object) {
    super(message, 429, error);
  }
}

// InternalServerErrorException: Unexpected server error
export class InternalServerErrorException extends HttpException {
  constructor(message: string, public error?: Object) {
    super(message, 500, error);
  }
}
