import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import jwt, { TokenExpiredError } from 'jsonwebtoken';

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler(400, errors.array().map(err => err.msg)));
    }

    const {
        email,
        password
    } = req.body;

    try {

        const userExists = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (userExists) {
            return next(errorHandler(400, 'User already exists'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            statusCode: "201",
            message: "User created",
            data: {
                id: user.id,
                email: user.email,
            }
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

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

        res.json({
            statusCode: "200",
            message: "Sign in successful",
            data: {
                id: user.id,
                email: user.email,
                accessToken,
                refreshToken
            }
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler(400, errors.array().map(err => err.msg)));
    }

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(errorHandler(400, 'Refresh token is required'));
    }

    if (typeof refreshToken !== 'string') {
        return next(errorHandler(400, 'Invalid refresh token'));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload;

        const newAccessToken = generateAccessToken(decoded.userId);

        res.status(200).json({
            accessToken: newAccessToken,
        });

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return next(errorHandler(401, 'Unauthorized: Refresh token has expired'));
        }
        next(errorHandler(401, 'Unauthorized: Invalid token'));
    }
};
