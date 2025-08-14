import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import userRoutes from "./user.routes.js";
import customerRoutes from "./customer.routes.js"
import vendorRoutes from "./vendor.routes.js";
import authRoutes from "./auth.routes.js";
import otpRoutes from "./otp.routes.js";
import serviceRoutes from "./service.routes.js";

const router = express.Router();

router.use('/user', userRoutes);
router.use('/customer', customerRoutes);
router.use('/vendor', vendorRoutes);
router.use('/auth', authRoutes);
router.use('/otp', otpRoutes);
router.use('/service', serviceRoutes);

export default router;