import { createOtp, verifyOtp } from "../controllers/otp.controller.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/otp/send:
 *   get:
 *     summary: Send OTP to user's email
 *     tags: [OTP]
 *     parameters:
 *       - in: header
 *         name: recipient
 *         required: true
 *         schema:
 *           type: string
 *           example: user@example.com
 *         description: Email address of the user to receive the OTP
 *     responses:
 *       201:
 *         description: OTP has been successfully sent
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
 *                 otpId:
 *                   type: string
 *       400:
 *         description: Recipient header missing or user not found
 *       500:
 *         description: Failed to send OTP or internal server error
 */
router.get("/send", createOtp);

/**
 * @swagger
 * /api/otp/verify:
 *   post:
 *     summary: Verify an OTP using its ID
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otpId
 *               - otp
 *             properties:
 *               otpId:
 *                 type: string
 *                 example: clxjbd9dr0000wd8t5t6ac3eu
 *               otp:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: OTP verified successfully
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
 *                 recipient:
 *                   type: string
 *       400:
 *         description: Missing fields
 *       404:
 *         description: OTP not found or expired
 *       401:
 *         description: OTP mismatched
 *       500:
 *         description: Internal server error
 */
router.post("/verify", verifyOtp);


export default router;