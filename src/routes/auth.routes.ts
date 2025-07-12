import express from "express";
import { signUp, signIn, refreshAccessToken, logout } from "../controllers";
import { signupValidation, signinValidation } from "../validations";
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
    refreshAccessToken
);

authRoutes.post(
    "/logout",
    authLimiter,
    logout
);

export default authRoutes;
