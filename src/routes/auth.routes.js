import express from 'express';
import { loginUser, getUserDetails  } from "../controllers/auth.controller.js";
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login with JWT
 */
router.post('/login', loginUser);


/**
 * @swagger
 * /api/auth/user/details:
 *   post:
 *     summary: Get user details from token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details returned
 *       401:
 *         description: Unauthorized
 */
// Get user details from decoded token
router.post('/user/details', authenticateToken, getUserDetails);

/**
 * @swagger
 * /api/auth/protected:
 *   get:
 *     summary: Test protected route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated access
 *       401:
 *         description: Unauthorized
 */
// protected route for testing JWT authentication
router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: "You are auhtenticated",
        user: req.user
    });
});


export default router;