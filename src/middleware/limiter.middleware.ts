import rateLimit from 'express-rate-limit';
import { Request } from 'express';

export const createRateLimiter = (windowMs: number, max: number, message: string) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            statusCode: 429,
            error: 'Too Many Requests',
            message
        },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req: Request) => {
            return req.ip || req.connection.remoteAddress || 'unknown';
        }
    });
};

export const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5,
    'Too many authentication attempts, please try again later.'
);

export const noteLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    30,
    'Too many note operations, please try again later.'
);
