import express from "express";
import {
    signUp,
    signIn,
    refreshAccessToken
} from "../controllers/auth.controller";
import {
    signupValidation,
    signinValidation,
    refreshAccessTokenValidation
} from "../validations/auth.validation";
import { authLimiter } from '../middleware/limiter.middleware';

const authRouter = express.Router();

authRouter.post(
    "/signup",
    authLimiter,
    signupValidation(),
    signUp
);

authRouter.post(
    "/signin",
    authLimiter,
    signinValidation(),
    signIn
);

authRouter.post(
    "/refresh-token",
    authLimiter,
    refreshAccessTokenValidation(),
    refreshAccessToken
);

export default authRouter;
