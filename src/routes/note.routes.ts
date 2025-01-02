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

const router = express.Router();

router.post(
    "/create-note",
    noteLimiter,
    protect,
    createNoteValidation(),
    createNote
);

router.get(
    "/get-notes",
    noteLimiter,
    protect,
    paginateResults,
    getNotes
);
router.get(
    "/get-note/:id",
    noteLimiter,
    protect,
    getNote
);
router.get(
    "/search-notes",
    noteLimiter,
    protect,
    paginateResults,
    searchNotes
)

router.put(
    "/update-note/:id",
    noteLimiter,
    protect,
    updateNoteValidation(),
    updateNote
);

router.delete(
    "/delete-note/:id",
    noteLimiter,
    protect,
    deleteNote
);

export default router;