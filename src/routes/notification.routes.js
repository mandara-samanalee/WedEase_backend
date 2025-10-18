import express from "express";
import {       getNotificationsByUserIdController,
markAllNotificationsAsReadController,
getUnreadNotificationCountController
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get all notifications for a user
router.get("/user/:userId", getNotificationsByUserIdController);

// make all notifications as read
router.put("/read-all/:userId", markAllNotificationsAsReadController);

// Get unread notification count
router.get("/:userId/unread-count", getUnreadNotificationCountController);

export default router;
