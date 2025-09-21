import {
    createServiceCategory,
    getAllCategories,
    updateServiceCategory,
    deleteServiceCategory,
} from '../models/category.model.js';

// Create new service category
export const CreateServiceCategoryController = async (req, res) => {
    try {
        const categoryData = await createServiceCategory(req.body);
        return res.status(201).json({
            success: true,
            code: 201,
            message: 'Service category created successfully',
            data: categoryData,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            code: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// get all service categories
export const GetAllCategoriesController = async (req, res) => {
    try {
        const categories = await getAllCategories();
        return res.status(200).json({
            success: true,
            code: 200,
            message: 'Service categories fetched successfully',
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

// update service category
export const UpdateServiceCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const updatedData = req.body;
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "categoryId is required",
            });
        }
        const updatedCategory = await updateServiceCategory(categoryId, updatedData);
        return res.status(200).json({
            success: true,
            code: 200,
            message: "Service category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
}

// delete service category
export const DeleteServiceCategoryController = async (req, res) => {
    try { 
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "categoryId is required",
            });
        }
        await deleteServiceCategory(categoryId);
        return res.status(200).json({
            success: true,
            code: 200,
            message: "Service category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
}