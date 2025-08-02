import express from 'express';
import { loginUser, getUserDetails  } from "../controllers/auth.controller.js";
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);

// Get user details from decoded token
router.post('/user/details', authenticateToken, getUserDetails);

// protected route for testing JWT authentication
router.get('protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: "You are auhtenticated",
        user: req.user
    });
});


export default router;