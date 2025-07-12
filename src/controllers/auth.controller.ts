import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { errorHandler, generateAccessToken, generateRefreshToken, generateUniqueUsername } from "../utils";
import prisma from "../database/prismaClient";

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errorHandler(400, errors.array().map(err => err.msg)))
    }

    const { email, password } = req.body

    try {
        const userExists = await prisma.user.findUnique({ where: { email } })
        if (userExists) {
            return next(errorHandler(400, 'User already exists'))
        }

        const emailPrefix = email.split('@')[0]
        const username = await generateUniqueUsername(emailPrefix)

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        })

        res.status(201).json({
            statusCode: '201',
            message: 'User created',
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        })
    } catch (error: unknown) {
        next(
            error instanceof Error
                ? errorHandler(500, `Internal Server Error, ${error.message}`)
                : errorHandler(500, 'An unknown error occurred')
        )
    }
}


export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler(400, errors.array().map(err => err.msg)));
    }

    const {
        email,
        password
    } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(errorHandler(401, 'Invalid credentials'));
        }

        const accessToken = generateAccessToken(user.id.toString());
        const refreshToken = generateRefreshToken(user.id.toString());

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 5 * 60 * 60 * 1000 // 5 hours
        });

        res.json({
            statusCode: "200",
            message: "Sign in successful",
            data: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(errorHandler(401, 'Refresh token is required'));
    }

    if (typeof refreshToken !== 'string') {
        return next(errorHandler(400, 'Invalid refresh token'));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload;

        const newAccessToken = generateAccessToken(decoded.userId);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.status(200).json({
            statusCode: "200",
            message: "Access token refreshed successfully"
        });

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return next(errorHandler(401, 'Unauthorized: Refresh token has expired'));
        }
        next(errorHandler(401, 'Unauthorized: Invalid token'));
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Clear both access and refresh token cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            statusCode: "200",
            message: "Logged out successfully"
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};
