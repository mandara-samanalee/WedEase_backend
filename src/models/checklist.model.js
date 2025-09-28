import prisma from "../config/db.js";

// Create or Update multiple tasks + subtasks
export const saveOrUpdateTasksModel = async (eventId, tasks) => {
    try {
        const results = [];

        for (const task of tasks) {
            // Upsert Task
            const savedTask = await prisma.weddingChecklist.upsert({
                where: { id: task.id || 0 }, // if no id, Prisma ignores (use create)
                update: {
                    taskTitle: task.taskTitle,
                    description: task.description || null,
                    updatedAt: new Date(),
                },
                create: {
                    eventId,
                    taskTitle: task.taskTitle,
                    description: task.description || null,
                },
            });

            // Handle subtasks if provided
            if (task.subtasks && Array.isArray(task.subtasks)) {
                for (const sub of task.subtasks) {
                    await prisma.checklistSubtask.upsert({
                        where: { id: sub.id || 0 },
                        update: {
                            subtask: sub.subtask,
                            status: sub.status || "todo",
                            assignedTo: sub.assignedTo || null,
                            bucket: sub.bucket || "6m",
                            updatedAt: new Date(),
                        },
                        create: {
                            subtask: sub.subtask,
                            status: sub.status || "todo",
                            assignedTo: sub.assignedTo || null,
                            bucket: sub.bucket || "6m",
                            checklistId: savedTask.id,
                        },
                    });
                }
            }

            // Fetch task again with subtasks
            const fullTask = await prisma.weddingChecklist.findUnique({
                where: { id: savedTask.id },
                include: { subtasks: true },
            });

            results.push(fullTask);
        }
        return results;
    } catch (error) {
        console.error("Error in Model function:", error);
        throw new Error("Failed to save or update checklist");
    }
};


// Get all tasks + subtasks by Event ID
export const getTasksByEventIdModel = async (eventId) => {
    try {
        const checklist = await prisma.weddingChecklist.findMany({
            where: { eventId },
            include: { subtasks: true },
            orderBy: { createdAt: "asc" },
        });
        return checklist;
    } catch (error) {
        console.error("Error in Model function:", error);
        throw new Error("Failed to get checklist by eventId");
    }
};


// Delete a single subtask
export const deleteSubtaskById = async (id) => {
    try {
        return await prisma.checklistSubtask.delete({
            where: { id: Number(id) },
        });
    } catch (error) {
        console.error("Error in Model function:", error);
        throw new Error("Failed to delete subtask");
    }
};

// Delete a task and all related subtasks
export const deleteTaskById = async (id) => {
    try {
        // selete subtasks
        await prisma.checklistSubtask.deleteMany({
            where: { checklistId: Number(id) },
        });

        // delete main task
        const deletedTask = await prisma.weddingChecklist.delete({
            where: { id: Number(id) },
        });

        return deletedTask;
    } catch (error) {
        console.error("Error in Model function:", error);
        throw new Error("Failed to delete Task and related subtasks");
    }
};
