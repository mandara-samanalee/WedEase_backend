import prisma from "../config/db.js";

// Save (Create or Update) Budget
export const saveOrUpdateBudgetModel = async (eventId, TotalBudget, categories) => {
    try {
        // Calculate totals
        const allocatedBudget = categories.reduce((sum, c) => sum + (c.allocatedAmount || 0), 0);
        const spentBudget = categories.reduce((sum, c) => sum + (c.spentAmount || 0), 0);
        const remainingBudget = (TotalBudget) - allocatedBudget;

        // Upsert Budget
        const budget = await prisma.budget.upsert({
            where: { eventId },
            update: {
                TotalBudget,
                AllocatedBudget: allocatedBudget,
                SpentBudget: spentBudget,
                RemainingBudget: remainingBudget,
                updatedAt: new Date(),
            },
            create: {
                eventId,
                TotalBudget,
                AllocatedBudget: allocatedBudget,
                SpentBudget: spentBudget,
                RemainingBudget: remainingBudget,
            },
        });

        // Upsert Categories
        if (categories && categories.length > 0) {
            for (const cat of categories) {
                await prisma.budgetCategory.upsert({
                    where: {
                        categoryName_budgetId: {
                        categoryName: cat.categoryName,
                        budgetId: budget.id,
                    },
                },
                    update: {
                        allocatedAmount: cat.allocatedAmount,
                        spentAmount: cat.spentAmount,
                        updatedAt: new Date(),
                    },
                    create: {
                        categoryName: cat.categoryName,
                        allocatedAmount: cat.allocatedAmount,
                        spentAmount: cat.spentAmount,
                        budgetId: budget.id,
                    },
                });
            }
        }
        return { budget, categories };
    } catch (error) {
        console.error("Error in Model function:", error);
        throw new Error("Failed to save or update budget");
    }
};


// Get budget by Event
export const getBudgetByEventIdModel = async (eventId) => {
    try {
        const GetDetails = await prisma.budget.findUnique({
            where: { eventId },
            include: { categories: true },
        });
        return GetDetails;
    } catch (error) {
        console.error("Error in Model function:", error);
        throw new Error("Failed to get budget by eventId");
    }
};


//  Delete category by Id
export const deleteCategoryByIdModel = async (id) => {
    try {
        // Find the category first
        const category = await prisma.budgetCategory.findUnique({
            where: { id: Number(id) },
        });

        if (!category) {
            throw new Error("Category not found");
        }

        // Delete the category
        const deleted = await prisma.budgetCategory.delete({
            where: { id: Number(id) },
        });

        // Update the parent budget
        let updatedBudget = null;

        if (category.budgetId) {
            const budget = await prisma.budget.findUnique({
                where: { id: category.budgetId },
            });

            if (!budget) {
                throw new Error("Budget not found");
            }

            // Calculate new values
            const newAllocated = (budget.AllocatedBudget || 0) - (category.allocatedAmount || 0);
            const newSpent = (budget.SpentBudget || 0) - (category.spentAmount || 0);
            const newRemaining = (budget.TotalBudget) - newAllocated;

            updatedBudget = await prisma.budget.update({
                where: { id: category.budgetId },
                data: {
                    AllocatedBudget: newAllocated,
                    SpentBudget: newSpent,
                    RemainingBudget: newRemaining,
                    updatedAt: new Date(),
                },
                include: { 
                    categories: true 
                },
            });
        }

        return updatedBudget;
    } catch (error) {
        console.error("Error in Model function:", error);
        throw new Error("Failed to delete category");
    }
};
