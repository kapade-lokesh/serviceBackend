import { ZodError } from "zod";

class ApiError extends Error {
  public statusCode: number;
  public message: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

class UseralreadyExist extends ApiError {
  constructor() {
    super("User Already Exist", 409);
  }
}

class AuthenticationError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}

class AuthonrizationError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}

class InvalidInput extends ApiError {
  public details: any;
  constructor(error: ZodError) {
    super("Invalid Input", 422);
    this.details = error.issues.reduce((acc, issue) => {
      const field = issue.path.join(".");
      if (!acc[field]) acc[field] = [];
      acc[field].push(issue.message);
      return acc;
    }, {} as Record<string, string[]>);
  }
}

class NotFoundError extends ApiError {
  constructor(resource: any) {
    super(`${resource} not found `, 404);
  }
}

class InternalServerError extends ApiError {
  constructor() {
    super("Internal Server Error", 500);
  }
}

export {
  ApiError,
  UseralreadyExist,
  InvalidInput,
  NotFoundError,
  InternalServerError,
  AuthenticationError,
  AuthonrizationError,
};
