import prisma from "../config/db.js";

// create new service category
export const createServiceCategory = async (categoryData) => {
    try {
        const { name, description } = categoryData;
        if (!name || !description) {
            throw new Error("Name and description are required");
        }

        const existingCategory = await prisma.serviceCategories.findUnique({
            where: { name }
        });
        if (existingCategory) {
            throw new Error("Category with this name already exists");
        }

        const newCategory = await prisma.serviceCategories.create({
            data: {
                name,
                description
            }
        });
        return newCategory;
    } catch (error) {
        throw new Error("Error creating category: " + error.message);
    }
}

// get all service categories
export const getAllCategories = async () => {
    try {
        const categories = await prisma.serviceCategories.findMany();
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Error fetching categories: " + error.message);
    }
}

// update service category
export const updateServiceCategory = async (categoryId, updateData) => {
    try {
        const { name, description } = updateData;
        if (!name && !description) {
            throw new Error("At least one field (name or description) is required for update");
        }

        const existingCategory = await prisma.serviceCategories.findUnique({
            where: { id: parseInt(categoryId) }
        });
        if (!existingCategory) {
            throw new Error("Category not found");
        }

        if (name && name !== existingCategory.name) {
            const nameConflict = await prisma.serviceCategories.findUnique({
                where: { name }
            });
            if (nameConflict) {
                throw new Error("Another category with this name already exists");
            }
            existingCategory.name = name;
        }

        if (description) {
            existingCategory.description = description;
        }

        const updatedCategory = await prisma.serviceCategories.update({
            where: { id: parseInt(categoryId) },
            data: {
                name: existingCategory.name,
                description: existingCategory.description
            }
        });
        return updatedCategory;
    } catch (error) {
        throw new Error("Error updating category: " + error.message);
    }
}

// delete category
export const deleteServiceCategory = async (categoryId) => {
    try {
        const existingCategory = await prisma.serviceCategories.findUnique({
            where: { id: parseInt(categoryId) }
        });
        if (!existingCategory) {
            throw new Error("Category not found");
        }
        await prisma.serviceCategories.delete({
            where: { id: parseInt(categoryId) }
        });
        return;
    } catch (error) {
        throw new Error("Error deleting category: " + error.message);
    }
}