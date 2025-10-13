import express from "express";
import {
    saveChecklistController,
    getChecklistByEventIdController,
    deleteSubtaskController,
    deleteTaskController,
} from "../controllers/checklist.controller.js";

const router = express.Router();

router.post("/save", saveChecklistController);
router.get("/:eventId", getChecklistByEventIdController);
router.delete("/subtask/:id", deleteSubtaskController);
router.delete("/task/:id", deleteTaskController);

export default router;
