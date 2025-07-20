import express from 'express';
import customerRoutes from "./customer.routes.js"

const router = express.Router();

router.use('/customer', customerRoutes);

export default router;