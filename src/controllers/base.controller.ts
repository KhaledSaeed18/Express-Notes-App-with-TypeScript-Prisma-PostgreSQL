import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppError, ValidationError } from "../errors";

export abstract class BaseController {
    protected handleValidationErrors(req: Request, next: NextFunction): boolean {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => ({
                field: err.type === 'field' ? err.path : 'unknown',
                message: err.msg,
                value: err.type === 'field' ? err.value : undefined
            }));

            const formattedMessage = errorMessages.map(err =>
                `${err.field}: ${err.message}`
            ).join(', ');

            next(new ValidationError(formattedMessage, errorMessages));
            return false;
        }
        return true;
    }

    protected handleError(error: unknown, next: NextFunction): void {
        next(error);
    }

    protected sendResponse(res: Response, statusCode: number, message: string, data?: any): void {
        res.status(statusCode).json({
            statusCode,
            message,
            data
        });
    }

    protected sendPaginatedResponse(
        res: Response,
        statusCode: number,
        message: string,
        data: any,
        pagination: {
            currentPage?: number;
            totalPages?: number;
            totalItems?: number;
            itemsPerPage?: number;
            hasNext?: boolean;
            hasPrev?: boolean;
        }
    ): void {
        res.status(statusCode).json({
            statusCode,
            message,
            data,
            pagination
        });
    }

    protected getUserId(req: Request, next: NextFunction): string | null {
        const userId = req.user?.userId;
        if (!userId) {
            next(new AppError('Unauthorized', 401));
            return null;
        }
        return userId;
    }

    protected setCookie(res: Response, name: string, value: string, maxAge: number): void {
        res.cookie(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge
        });
    }

    protected clearCookie(res: Response, name: string): void {
        res.clearCookie(name);
    }
}
