/*
    * src/utils/error
    * Error handling utilities for the Express App.
    * This module defines custom error classes and a utility function for creating error objects.
*/

export const errorHandler = (statusCode: number, message: string | string[]) => {
    const errorMessage = Array.isArray(message) ? message : [message];
    const error: any = new Error(errorMessage.join(', '));
    error.statusCode = statusCode;
    error.message = errorMessage.length === 1 ? errorMessage[0] : errorMessage;
    return error;
};