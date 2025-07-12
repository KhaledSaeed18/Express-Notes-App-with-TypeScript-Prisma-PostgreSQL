import { body } from 'express-validator';

export const createNoteValidation = () => {
    return [
        body('title')
            .exists()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a string')
            .notEmpty()
            .withMessage('Title cannot be empty')
            .isLength({ min: 1, max: 255 })
            .withMessage('Title must be between 1 and 255 characters')
            .trim(),
        body('content')
            .exists()
            .withMessage('Content is required')
            .isString()
            .withMessage('Content must be a string')
            .notEmpty()
            .withMessage('Content cannot be empty')
            .isLength({ min: 1 })
            .withMessage('Content must not be empty')
            .trim(),
    ];
}

export const updateNoteValidation = () => {
    return [
        body('title')
            .optional()
            .isString()
            .withMessage('Title must be a string')
            .notEmpty()
            .withMessage('Title cannot be empty')
            .isLength({ min: 1, max: 255 })
            .withMessage('Title must be between 1 and 255 characters')
            .trim(),
        body('content')
            .optional()
            .isString()
            .withMessage('Content must be a string')
            .notEmpty()
            .withMessage('Content cannot be empty')
            .isLength({ min: 1 })
            .withMessage('Content must not be empty')
            .trim(),
    ];
}