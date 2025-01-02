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

const router = express.Router();

router.post(
    "/signup",
    authLimiter,
    signupValidation(),
    signUp
);

router.post(
    "/signin",
    authLimiter,
    signinValidation(),
    signIn
);

router.post(
    "/refresh-token",
    authLimiter,
    refreshAccessTokenValidation(),
    refreshAccessToken
)

export default router;
