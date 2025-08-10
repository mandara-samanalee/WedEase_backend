import express from 'express';
import { createVendorController, updateVendorProfileController,  GetVendorDetailsController } from '../controllers/vendor.controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * /api/vendor/register:
 *   post:
 *     summary: Register a new vendor
 *     tags: [Vendor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - address
 *               - city
 *               - contactNo
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               address:
 *                 type: string
 *                 example: 123 Vendor St.
 *               city:
 *                 type: string
 *                 example: Colombo
 *               contactNo:
 *                 type: string
 *                 example: "+94770000000"
 *     responses:
 *       201:
 *         description: Vendor registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     address:
 *                       type: string
 *                     city:
 *                       type: string
 *                     contactNo:
 *                       type: string
 *       400:
 *         description: Bad request (validation errors)
 *       500:
 *         description: Server error
 */
router.post('/register', createVendorController);

router.put('/profile/:userId', upload.single('image'),updateVendorProfileController);

router.get('/getdetails/:userId', GetVendorDetailsController);

export default router;