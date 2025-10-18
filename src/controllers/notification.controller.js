import {
    getNotificationsByUserId,
    markAllNotificationsAsRead,
    getUnreadNotificationCount
} from "../models/notification.model.js";

// Controller to get all notifications by userId
export const getNotificationsByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "userId is required",
            });
        }

        const notifications = await getNotificationsByUserId(userId);

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Notifications fetched successfully",
            data: notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to fetch notifications",
            error: error.message,
        });
    }
};


// Mark all notifications as read for a user
export const markAllNotificationsAsReadController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "User ID is required",
            });
        }

        const result = await markAllNotificationsAsRead(userId);

        return res.status(200).json({
            code: 200,
            success: true,
            message: "All notifications marked as read",
            data: result,
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to mark notifications as read",
            error: error.message,
        });
    }
};


// Get unread notification count for a user
export const getUnreadNotificationCountController = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "userId is required"
            });
        }

        const unreadCount = await getUnreadNotificationCount(userId);

        return res.status(200).json({
            code:200,
            success: true,
            message: "Get unread notifications successfully",
            unreadCount,
        });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to fetch unread notifications",
            error: error.message,
        });
    }
};
