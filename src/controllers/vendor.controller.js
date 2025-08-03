import { createVendorModel } from "../models/vendor.model.js";
import { findUserByEmail } from "../models/user.model.js";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// create new vendor
export const createVendorController = async (req, res) => {
    try {
        const { firstName, lastName, email, address, city, contactNo, password, confirmPassword } = req.body;

        if (!firstName || !lastName || !email || !address || !city || !contactNo || !password || !confirmPassword) {
            return res.status(500).json({
                code: 500,
                status: "false",
                message: "All fields are required",
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                code: 400,
                status: "false",
                message: "passwords do not match",
            });
        }

        const existingUser = await findUserByEmail(req.body.email);
        if (existingUser) {
            return res.status(500).json({
                code: 500,
                status: "false",
                message: "User already exists with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        
        const newVendor = await createVendorModel({
            ...req.body,
            password: hashedPassword
        });

        return res.status(201).json({
            code: 201,
            status: "true",
            message: "User registered successfully",
            data: newVendor,
        });
    } catch (error) {
        console.error("Error in registerController:", error);
        return res.status(500).json({
            code: 500,
            status: "false",
            message: "Internal server error",
            data: null,
        });
    }
};
