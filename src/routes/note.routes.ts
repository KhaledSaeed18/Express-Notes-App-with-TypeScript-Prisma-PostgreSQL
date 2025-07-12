import express from "express";
import {
    createNote,
    getNote,
    getNotes,
    updateNote,
    deleteNote,
    searchNotes
} from "../controllers/note.controller";
import { protect } from "../middleware/auth.middleware";
import {
    createNoteValidation,
    updateNoteValidation
} from "../validations/note.validation";
import { noteLimiter } from "../middleware/limiter.middleware";
import { paginateResults } from "../middleware/pagination.middleware";

const noteRoutes = express.Router();

noteRoutes.post(
    "/create-note",
    noteLimiter,
    protect,
    createNoteValidation(),
    createNote
);

noteRoutes.get(
    "/get-notes",
    noteLimiter,
    protect,
    paginateResults,
    getNotes
);
noteRoutes.get(
    "/get-note/:id",
    noteLimiter,
    protect,
    getNote
);
noteRoutes.get(
    "/search-notes",
    noteLimiter,
    protect,
    paginateResults,
    searchNotes
)

noteRoutes.put(
    "/update-note/:id",
    noteLimiter,
    protect,
    updateNoteValidation(),
    updateNote
);

noteRoutes.delete(
    "/delete-note/:id",
    noteLimiter,
    protect,
    deleteNote
);

export default noteRoutes;