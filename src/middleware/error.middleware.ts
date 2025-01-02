import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        statusCode,
        message,
    });
};

export default errorMiddleware;