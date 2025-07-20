import express from 'express';
import { createUserController } from "../controllers/customer.controller.js";

const router = express.Router();
/**
 * @swagger
 * /customer/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer registered successfully
 */
router.post('/register', createUserController);

export default router;