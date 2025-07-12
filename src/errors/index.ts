/*
    * src/errors/index.ts
    * This file defines custom error classes for the application.
    * Each class extends the base Error class and includes additional properties.
*/

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

// ValidationError class for handling validation errors
// This error is thrown when input validation fails, such as when required fields are missing or invalid
export class ValidationError extends AppError {
    public errors?: Array<{
        field: string;
        message: string;
        value?: any;
    }>;

    constructor(message: string, errors?: Array<{ field: string; message: string; value?: any }>) {
        super(message, 400);
        this.errors = errors;
    }
}

// AuthenticationError class for handling authentication failures
// This error is thrown when a user fails to authenticate, such as providing invalid credentials
export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(message, 401);
    }
}

// AuthorizationError class for handling authorization failures
// This error is thrown when a user tries to access a resource they are not authorized to access
export class AuthorizationError extends AppError {
    constructor(message: string = 'Access denied') {
        super(message, 403);
    }
}

// NotFoundError class for handling resource not found errors
// This error is thrown when a requested resource cannot be found, such as a user or note that does not exist
export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

// ConflictError class for handling resource conflicts
// This error is thrown when a resource already exists, such as trying to create a user with an email that is already registered
export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409);
    }
}

// InternalServerError class for handling unexpected server errors
// This error is thrown when an unexpected error occurs on the server, such as a database connection failure
export class InternalServerError extends AppError {
    constructor(message: string = 'Internal server error') {
        super(message, 500);
    }
}
