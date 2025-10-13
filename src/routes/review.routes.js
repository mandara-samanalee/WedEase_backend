import express from "express";
import {
    createReviewController,
    updateReviewController,
    deleteReviewController,
    getReviewsByServiceIdController
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/add", createReviewController);

router.put("/update/:id", updateReviewController);

router.delete("/delete/:id", deleteReviewController);

router.post("/service", getReviewsByServiceIdController);


export default router;
