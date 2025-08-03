import express from 'express';
import { 
    createUserController, updateCustomerProfileController 
} from "../controllers/customer.controller.js";
import { upload } from '../middleware/upload.js';

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
router.post('/customer/register', createUserController);

router.put('/customer/profile/:userId', upload.single('image'), updateCustomerProfileController);

export default router;