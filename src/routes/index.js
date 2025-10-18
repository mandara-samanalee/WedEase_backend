import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import userRoutes from "./user.routes.js";
import customerRoutes from "./customer.routes.js"
import vendorRoutes from "./vendor.routes.js";
import authRoutes from "./auth.routes.js";
import otpRoutes from "./otp.routes.js";
import serviceRoutes from "./service.routes.js";
import eventRoutes from "./event.routes.js";
import budgetRoutes from "./budget.routes.js";
import rsvpRoutes from "./rsvp.routes.js";
import categoryRoutes from "./category.routes.js";
import checklistRoutes from "./checklist.routes.js";
import agendaRoutes from "./agenda.routes.js";
import bookingRoutes from "./booking.routes.js";
import reviewRoutes from "./review.routes.js";
import adminRoutes from "./admin.routes.js";
import notificationRoutes from "./notification.routes.js";

const router = express.Router();

router.use('/user', userRoutes);
router.use('/customer', customerRoutes);
router.use('/vendor', vendorRoutes);
router.use('/auth', authRoutes);
router.use('/otp', otpRoutes);
router.use('/service', serviceRoutes);
router.use('/event', eventRoutes);
router.use('/budget',  budgetRoutes);
router.use('/rsvp', rsvpRoutes);
router.use('/category', categoryRoutes);
router.use('/checklist', checklistRoutes);
router.use('/agenda', agendaRoutes);
router.use('/booking', bookingRoutes);
router.use('/review', reviewRoutes);
router.use('/admin', adminRoutes);
router.use('/notification', notificationRoutes);

export default router;