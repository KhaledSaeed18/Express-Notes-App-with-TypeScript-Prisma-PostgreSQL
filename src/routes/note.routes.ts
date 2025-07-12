import express from "express";
import { noteLimiter, paginateResults, protect } from "../middleware";
import { createNoteValidation, updateNoteValidation } from "../validations";
import { createNote, deleteNote, getNote, getNotes, searchNotes, updateNote } from "../controllers";

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