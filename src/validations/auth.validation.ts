import { body } from 'express-validator';
import { BLOCKED_DOMAINS, COMMON_PASSWORDS } from '../constants';

export const signupValidation = () => {
    return [
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email format')
            .normalizeEmail()
            .custom(async (email) => {
                const blockedDomains = BLOCKED_DOMAINS;
                const domain = email.split('@')[1];
                if (blockedDomains.includes(domain)) {
                    throw new Error('Email domain not allowed');
                }
                return true;
            }),
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .isLength({ max: 30 }).withMessage('Password must not be more than 30 characters')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/\d/).withMessage('Password must contain at least one number')
            .matches(/[\W_]/).withMessage('Password must contain at least one special character')
            .custom((value) => {
                const commonPasswords = COMMON_PASSWORDS;
                if (commonPasswords.includes(value)) {
                    throw new Error('Password is too common');
                }
                return true;
            }),
    ];
};

export const signinValidation = () => {
    return [
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Invalid email format')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Password is required'),
    ];
};