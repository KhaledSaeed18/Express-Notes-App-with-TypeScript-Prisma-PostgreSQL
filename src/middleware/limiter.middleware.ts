import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 5,
    message: 'Too many requests, please try again after 30 minutes'
});

export const noteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    message: 'Too many requests, please try again after 15 minutes'
});
