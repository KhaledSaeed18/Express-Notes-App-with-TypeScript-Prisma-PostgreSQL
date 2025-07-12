/*
    * src/middleware/auth.middleware.ts
    * Middleware for protecting routes by verifying JWT tokens.
    * This middleware checks for a valid JWT token in the request headers or cookies.
*/

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { errorHandler } from '../utils';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

// Middleware to protect routes
// Checks for a JWT token in the request cookies or Authorization header
// If the token is valid, it decodes the user information and attaches it to the request object
// If the token is missing or invalid, it returns an error response
export const protect = (req: Request, _res: Response, next: NextFunction): void => {
    let token = req.cookies.accessToken;

    if (!token) {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(errorHandler(403, 'Access denied: No token provided'));
        }
        token = authHeader.split(' ')[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return next(errorHandler(401, 'Unauthorized: Token has expired'));
        }
        next(errorHandler(401, 'Unauthorized: Invalid token'));
    }
};