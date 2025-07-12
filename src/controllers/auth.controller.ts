import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import crypto from 'crypto'
import { errorHandler, generateAccessToken, generateRefreshToken } from "../utils";
import prisma from "../database/prismaClient";

function generateUsername(base?: string): string {
    if (base) {
        const sanitized = base.toLowerCase().replace(/[^a-z0-9]/g, '')
        const suffix = crypto.randomInt(1000, 9999).toString()
        return sanitized + suffix
    }
    return 'user' + crypto.randomInt(10000, 99999).toString()
}

async function generateUniqueUsername(base: string, maxAttempts = 5): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const usernameCandidate = generateUsername(base)
        const exists = await prisma.user.findUnique({
            where: { username: usernameCandidate }
        })
        if (!exists) {
            return usernameCandidate
        }
    }
    throw new Error('Failed to generate unique username after several attempts')
}

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
