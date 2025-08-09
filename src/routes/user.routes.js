import { 
    forgotPassword, 
    changePasswordController,
    deleteUserAccountController,
    getUserByEmailController
} from '../controllers/user.controller.js';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Reset user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /user/change-password/{userId}:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/change-password/:userId', changePasswordController);


/**
 * @swagger
 * /api/delete-account/{userId}:
 *   delete:
 *     summary: Delete user account including related customer or vendor records
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *           example: clxkd7n0a0000t3yd5b6d0f1e
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-account/:userId', deleteUserAccountController );

/**
 * @swagger
 * /user/get-byemail/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: CUS00007
 *                 email:
 *                   type: string
 *                   example: mandarass6000@gmail.com
 *                 role:
 *                   type: string
 *                   example: CUSTOMER
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/get-byemail/:email', getUserByEmailController);


export default router;
