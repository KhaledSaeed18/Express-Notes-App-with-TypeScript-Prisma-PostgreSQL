import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors";
import { INoteService } from "../services";
import { BaseController } from "./base.controller";

export interface INoteController {
    createNote(req: Request, res: Response, next: NextFunction): Promise<void>;
    getNotes(req: Request, res: Response, next: NextFunction): Promise<void>;
    searchNotes(req: Request, res: Response, next: NextFunction): Promise<void>;
    getNote(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateNote(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteNote(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class NoteController extends BaseController implements INoteController {
    private noteService: INoteService;

    constructor(noteService: INoteService) {
        super();
        this.noteService = noteService;
    }

    public createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!this.handleValidationErrors(req, next)) return;

            const userId = this.getUserId(req, next);
            if (!userId) return;

            const { title, content } = req.body;

            const note = await this.noteService.createNote(userId, { title, content });

            this.sendResponse(res, 201, "Note created successfully", note);
        } catch (error) {
            this.handleError(error, next);
        }
    };

    public getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = this.getUserId(req, next);
            if (!userId) return;

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const result = await this.noteService.getUserNotes(userId, { skip, take: limit });

            this.sendPaginatedResponse(res, 200, "Notes retrieved successfully", result.data, {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalItems: result.total,
                itemsPerPage: result.limit,
                hasNext: result.page ? result.page < result.totalPages! : false,
                hasPrev: result.page ? result.page > 1 : false,
            });
        } catch (error) {
            this.handleError(error, next);
        }
    };

    public searchNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = this.getUserId(req, next);
            if (!userId) return;

            const query = req.query.q as string;
            if (!query) {
                return next(new AppError('Search query is required', 400));
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const result = await this.noteService.searchUserNotes(userId, query, { skip, take: limit });

            this.sendPaginatedResponse(res, 200, "Notes search completed successfully", result.data, {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalItems: result.total,
                itemsPerPage: result.limit,
                hasNext: result.page ? result.page < result.totalPages! : false,
                hasPrev: result.page ? result.page > 1 : false,
            });
        } catch (error) {
            this.handleError(error, next);
        }
    };

    public getNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = this.getUserId(req, next);
            if (!userId) return;

            const noteId = req.params.id;
            if (!noteId) {
                return next(new AppError('Note ID is required', 400));
            }

            const note = await this.noteService.getNoteById(userId, noteId);

            this.sendResponse(res, 200, "Note retrieved successfully", note);
        } catch (error) {
            this.handleError(error, next);
        }
    };

    public updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!this.handleValidationErrors(req, next)) return;

            const userId = this.getUserId(req, next);
            if (!userId) return;

            const noteId = req.params.id;
            if (!noteId) {
                return next(new AppError('Note ID is required', 400));
            }

            const { title, content } = req.body;

            const note = await this.noteService.updateNote(userId, noteId, { title, content });

            this.sendResponse(res, 200, "Note updated successfully", note);
        } catch (error) {
            this.handleError(error, next);
        }
    };

    public deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = this.getUserId(req, next);
            if (!userId) return;

            const noteId = req.params.id;
            if (!noteId) {
                return next(new AppError('Note ID is required', 400));
            }

            const note = await this.noteService.deleteNote(userId, noteId);

            this.sendResponse(res, 200, "Note deleted successfully", note);
        } catch (error) {
            this.handleError(error, next);
        }
    };
}
