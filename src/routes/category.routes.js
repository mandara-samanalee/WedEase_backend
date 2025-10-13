import express from 'express';
import {
    CreateServiceCategoryController,
    GetAllCategoriesController,
    UpdateServiceCategoryController,
    DeleteServiceCategoryController
} from '../controllers/category.controller.js';

const router = express.Router();

router.post('/create', CreateServiceCategoryController);
router.get('/all', GetAllCategoriesController);
router.put('/update/:categoryId', UpdateServiceCategoryController);
router.delete('/delete/:categoryId', DeleteServiceCategoryController);

export default router;
