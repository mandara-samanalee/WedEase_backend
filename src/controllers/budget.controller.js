import {
    saveOrUpdateBudgetModel,
    getBudgetByEventIdModel,
    deleteCategoryByIdModel,
} from "../models/budget.model.js";

// Save Budget + Categories
export const saveBudgetController = async (req, res) => {
    try {
        const { eventId, TotalBudget, categories } = req.body;

        if (!eventId || !TotalBudget) {
            return res.status(400).json({ 
                code: 400,
                success: false, 
                message: "eventId and TotalBudget are required" 
            });
        }

        const budget = await saveOrUpdateBudgetModel(eventId, TotalBudget, categories || []);

        return res.status(201).json({
            code: 201, 
            success: true,
            message: "Budget saved successfully",
            data: budget 
        });
    } catch (error) {
        console.error("Save Budget Error:", error);
        res.status(500).json({ 
            code: 500,
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

// Get Budget by EventId
export const getBudgetByEventIdController = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "eventId is required"
            });
        }
        const budget = await getBudgetByEventIdModel(eventId);

        if (!budget || Object.keys(budget).length === 0) {
            return res.status(404).json({ 
                code: 404,
                success: false, 
                message: "Budget details not found" 
            });
        }

        return res.status(200).json({ 
            code: 200,
            success: true, 
            message: "Budget details fetched successfully",
            data: budget 
        });
    } catch (error) {
        console.error("Get Budget Error:", error);
        res.status(500).json({ 
            code: 500,
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};


// Delete Category
export const deleteCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Category ID is required",
            });
        }

        const updatedBudget = await deleteCategoryByIdModel(id);

        return res.status(200).json({ 
            code: 200,
            success: true, 
            message: "Category deleted successfully",
            data: updatedBudget
        });
    } catch (error) {
        console.error("Delete Category Error:", error);
        return res.status(500).json({ 
            code: 500,
            success: false, 
            message: error.message,
            data: null 
        });
    }
};
