import jwt from 'jsonwebtoken';
import { findUserByEmail } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import prisma from "../config/db.js";

// login function
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: 'Email and password are required'
            })
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: "Invalid credentials"
            })
        }

        // Generate JWT token
        let token;
        try {
            token = jwt.sign(
                { userId: user.userId, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            console.log("Token generated:", token);

        } catch (error) {
            console.error("Error generating JWT token:", error);
            return res.status(500).json({
                status: false,
                code: 500,
                message: "Failed to generate JWT token"
            });
        }

        return res.status(200).json({
            status: true,
            code: 200,
            message: "Login successful",
            user: {
                userId: user.userId,
                email: user.email,
                role: user.role,
                token: token
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            code: 500,
            message: "Internal server error"
        });
    }
}

// get user details by userId
export const getUserDetails = async (req, res) => {
    try {
        const { userId, email, role } = req.user; // This comes from the auth middleware

        if (!userId) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: 'User ID missing from token'
            });
        }

        const customer = await prisma.customer.findUnique({
            where: { userId: userId }
        });
        if (customer) {
            return res.status(200).json({
                status: true,
                code: 200,
                message: 'Customer details retrieved successfully',
                data: customer,
                role: 'CUSTOMER'
            });
        }

        const vendor = await prisma.vendor.findUnique({
            where: { userId: userId }
        });
        if (vendor) {
            return res.status(200).json({
                status: true,
                code: 200,
                message: 'Vendor details retrieved successfully',
                data: vendor,
                role: 'VENDOR'
            })
        }

        return res.status(404).json({
            status: false,
            code: 404,
            message: 'User not found'
        });
    } catch (error) {
        console.error('Error retrieving user details:', error);
        return res.status(500).json({
            status: false,
            code: 500,
            message: 'Internal server error'
        });
    }
}
