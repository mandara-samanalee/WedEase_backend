import {
    saveOrUpdateTasksModel,
    getTasksByEventIdModel,
    deleteSubtaskById,
    deleteTaskById,
} from "../models/checklist.model.js";

// Save or Update multiple tasks with subtasks
export const saveChecklistController = async (req, res) => {
    try {
        const { eventId, tasks } = req.body;

        if (!eventId || !Array.isArray(tasks)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "eventId and tasks are required"
            });
        }

        const savedTasks = await saveOrUpdateTasksModel(eventId, tasks);
        return res.status(201).json({
            code: 201,
            success: true,
            message: "Checklist and Subtasks saved successfully",
            tasks: savedTasks
        });
    } catch (error) {
        console.error("Save Checklist Error:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// Get all tasks and subtasks by eventId
export const getChecklistByEventIdController = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "eventId is required"
            });
        }

        const tasks = await getTasksByEventIdModel(eventId);

        if (!tasks || tasks.length === 0) {
            return res.status(200).json({
                code: 200,
                success: true,
                message: "No checklist found for this event"
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Checklist fetched successfully",
            data: tasks
        });
    } catch (error) {
        console.error("Error fetching checklist:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to fetch checklist",
            error: error.message
        });
    }
};


// Delete a subtask
export const deleteSubtaskController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Subtask id is required"
            });
        }
        
        await deleteSubtaskById(id);
        return res.status(200).json({
            code: 200, 
            success: true, 
            message: "Subtask deleted successfully",
            data: null
        });
    } catch (error) {
        console.error("Delete Subtask Error:", error);
        return res.status(500).json({
            code: 500, 
            success: false, 
            message: "Failed to delete subtask",
            error: error.message 
        });
    }
};


// Delete a task (and all subtasks)
export const deleteTaskController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Task id is required"
            });
        }

        await deleteTaskById(id);
        return res.status(200).json({
            code: 200, 
            success: true, 
            message: "Task and related subtasks deleted successfully",
            data: null
        });
    } catch (error) {
        console.error("Delete Task Error:", error);
        return res.status(500).json({
            code: 500, 
            success: false, 
            message: "Failed to delete task and related subtaks details",
            error: error.message
        });
    }
};
