import prisma from "../config/db.js";

// Create a new notification
export const createNotification = async (recipients, bookingId, title, message) => {
    try {
        if (!recipients || recipients.length === 0) {
            console.warn("No recipients provided for notification");
            return [];
        }

        const notifications = await Promise.all(
            recipients.map(async (userId) => {
                try {
                    const notif = await prisma.notification.create({
                        data: {
                            userId,
                            bookingId,
                            title,
                            message,
                            isRead: false,
                        },
                    });

                    // Send real-time notification to the connected user via Socket.IO
                    if (global.io) {
                        global.io.to(userId).emit("notification", notif);
                    } else {
                        console.warn("⚠️ Socket.IO instance not found (global.io undefined)");
                    }

                    return notif;
                } catch (innerErr) {
                    console.error(`Failed to create notification for user ${userId}:`, innerErr);
                    return null;
                }
            })
        );

        return notifications.filter((n) => n !== null);
    } catch (error) {
        console.error("Error creating notifications:", error);
        throw new Error("Failed to create notifications");
    }
};


// Get notifications by userId
export const getNotificationsByUserId = async (userId) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return notifications;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw new Error("Failed to fetch notifications");
    }
};


// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId) => {
    try {
        const result = await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        return result;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw new Error("Failed to mark all notifications as read");
    }
};


// Get all unread notification count for a user
export const getUnreadNotificationCount = async (userId) => {
    try {
        const count = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
        return count;
    } catch (error) {
        console.error("Error fetching unread count from DB:", error);
        throw error;
    }
};