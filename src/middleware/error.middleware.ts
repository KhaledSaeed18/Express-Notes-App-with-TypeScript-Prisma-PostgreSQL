import { Request, Response } from 'express';

interface CustomError extends Error {
    statusCode?: number;
}

const errorMiddleware = (err: CustomError, _req: Request, res: Response): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        statusCode,
        message,
    });
};

export default errorMiddleware;