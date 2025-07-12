import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { AppError } from "../errors";
import { IAuthService } from "../services";
import { BaseController } from "./base.controller";

export interface IAuthController {
    signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
    signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
    refreshAccessToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class AuthController extends BaseController implements IAuthController {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        super();
        this.authService = authService;
    }

    public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!this.handleValidationErrors(req, next)) return;

            const { email, password } = req.body;

            const result = await this.authService.signUp({ email, password });

            this.sendResponse(res, 201, 'User created successfully', result.user);
        } catch (error) {
            this.handleError(error, next);
        }
    };

    public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!this.handleValidationErrors(req, next)) return;

            const { email, password } = req.body;

            const result = await this.authService.signIn({ email, password });

            // Set cookies
            this.setCookie(res, 'accessToken', result.accessToken!, 15 * 60 * 1000); // 15 minutes
            this.setCookie(res, 'refreshToken', result.refreshToken!, 5 * 60 * 60 * 1000); // 5 hours

            this.sendResponse(res, 200, "Sign in successful", result.user);
        } catch (error) {
            this.handleError(error, next);
        }
    };

    public refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return next(new AppError('Refresh token is required', 401));
            }

            if (typeof refreshToken !== 'string') {
                return next(new AppError('Invalid refresh token', 400));
            }

            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;
            const userId = decoded.id;

            const result = await this.authService.refreshToken(userId);

            this.setCookie(res, 'accessToken', result.accessToken, 15 * 60 * 1000); // 15 minutes

            this.sendResponse(res, 200, "Token refreshed successfully", { accessToken: result.accessToken });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return next(new AppError('Refresh token expired', 401));
            }
            this.handleError(error, next);
        }
    };

    public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            this.clearCookie(res, 'accessToken');
            this.clearCookie(res, 'refreshToken');

            this.sendResponse(res, 200, "Logged out successfully");
        } catch (error) {
            this.handleError(error, next);
        }
    };
}