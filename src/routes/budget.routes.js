import express from 'express';
import {
    saveBudgetController,
    getBudgetByEventIdController,
    deleteCategoryByIdController
} from '../controllers/budget.controller.js';

const router = express.Router();

router.post("/save-details", saveBudgetController);                   
router.get("/:eventId", getBudgetByEventIdController);         
router.delete("/category/:id", deleteCategoryByIdController); 

export default router;
