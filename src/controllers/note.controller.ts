import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils";

interface INote {
    id: string;
    title: string;
    content: string;
}

const prisma = new PrismaClient();

export const createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler(400, errors.array().map(err => err.msg)));
    }

    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    const {
        title,
        content
    } = req.body;

    try {
        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId: id
            }
        });

        res.status(201).json({
            statusCode: "201",
            message: "Note created",
            data: {
                id: note.id,
                title: note.title,
                content: note.content,
            }
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

export const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    try {
        if (!req.pagination) {
            return next(errorHandler(500, 'Pagination middleware not configured'));
        }

        const result = await req.pagination.getPaginationResult(
            prisma.note,
            {
                where: {
                    userId: id
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }
        );

        if (!result?.data || result.data.length === 0) {
            return next(errorHandler(404, 'No Notes found'));
        }

        res.json({
            statusCode: "200",
            message: "Notes retrieved",
            ...result,
        });
    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

export const searchNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    const query = req.query.q as string;

    try {
        if (!req.pagination) {
            return next(errorHandler(500, 'Pagination middleware not configured'));
        }

        const result = await req.pagination.getPaginationResult(
            prisma.note,
            {
                where: {
                    userId: id,
                    ...(query && {
                        OR: [
                            { title: { contains: query, mode: 'insensitive' } },
                            { content: { contains: query, mode: 'insensitive' } }
                        ]
                    })
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }
        );

        if (!result?.data || result.data.length === 0) {
            return next(errorHandler(404, 'No Notes found'));
        }

        res.json({
            statusCode: "200",
            message: "Notes retrieved",
            ...result,
        });
    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

export const getNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    const noteId = req.params.id;

    try {
        const note = await prisma.note.findUnique({
            where: {
                id: noteId
            }
        });

        if (!note) {
            return next(errorHandler(404, 'Note not found'));
        }

        res.json({
            statusCode: "200",
            message: "Note retrieved",
            data: note
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler(400, errors.array().map(err => err.msg)));
    }

    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    const noteId = req.params.id;
    const {
        title,
        content
    } = req.body;

    try {
        const note = await prisma.note.update({
            where: {
                id: noteId
            },
            data: {
                title,
                content
            }
        });

        res.json({
            statusCode: "200",
            message: "Note updated",
            data: note
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.user?.userId;
    if (!id) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    const noteId = req.params.id;

    try {
        await prisma.note.delete({
            where: {
                id: noteId
            }
        });

        res.json({
            statusCode: "200",
            message: `Note with id ${noteId} deleted`
        });

    } catch (error: unknown) {
        next(error instanceof Error
            ? errorHandler(500, `Internal Server Error, ${error.message}`)
            : errorHandler(500, 'An unknown error occurred'));
    }
};