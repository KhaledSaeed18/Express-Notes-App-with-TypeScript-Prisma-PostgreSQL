import express from "express";
import { signUp, signIn, refreshAccessToken } from "../controllers";
import { signupValidation, signinValidation, refreshAccessTokenValidation } from "../validations";
import { authLimiter } from '../middleware';

const authRoutes = express.Router();

authRoutes.post(
    "/signup",
    authLimiter,
    signupValidation(),
    signUp
);

authRoutes.post(
    "/signin",
    authLimiter,
    signinValidation(),
    signIn
);

authRoutes.post(
    "/refresh-token",
    authLimiter,
    refreshAccessTokenValidation(),
    refreshAccessToken
);

export default authRoutes;
