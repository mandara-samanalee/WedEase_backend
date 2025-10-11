import {
    createUserModel,
    updateCustomerProfileModel,
    GetCustomerDetailsModel,
    getAllCustomerDetailsModel,
    deleteCustomerAccountModel,
    getWeddingDashboardByUserIdModel
} from "../models/customer.model.js";
import { findUserByEmail } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const SALT_ROUNDS = 10;

// create new customer
export const createUserController = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
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

        const newCustomer = await createUserModel({
            ...req.body,
            password: hashedPassword
        });
        return res.status(201).json({
            code: 201,
            status: "true",
            message: "User registered successfully",
            data: newCustomer,
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

// Update customer profile
export const updateCustomerProfileController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, address, city, distric, province, country, contactNo } = req.body;

        let imageUrl;

        // if a file is uploaded, handle cloudinary upload
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'wedease_images',
                        resource_type: 'image',
                        public_id: `profile_${userId}`,
                        overwrite: true,
                    }, (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                        console.log("Cloudinary upload result:", result);
                    }
                );

                // Convert buffer into readable stream
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
            imageUrl = result.secure_url;
        }

        const updatedData = {
            firstName,
            lastName,
            address,
            city,
            contactNo,
            distric,
            province,
            country,
            image: imageUrl,
        };

        const updatedCustomer = await updateCustomerProfileModel(userId, updatedData);
        return res.status(200).json({
            code: 200,
            status: "true",
            message: "Profile updated successfully",
            data: updatedCustomer,
        });
    } catch {
        return res.status(500).json({
            code: 500,
            status: "false",
            message: "Internal server error",
            data: null,
        });
    }
};


// Get customer details
export const GetCustomerDetailsController = async (req, res) => {
    try {
        const { userId } = req.params;

        const customerDetails = await GetCustomerDetailsModel(userId);
        if (!customerDetails) {
            return res.status(404).json({
                code: 404,
                status: "false",
                message: "Customer not found",
                data: null,
            });
        }

        return res.status(200).json({
            code: 200,
            status: "true",
            message: "Customer details retrieved successfully",
            data: customerDetails,
        });
    } catch (error) {
        console.error("Error retrieving customer details:", error);
        return res.status(500).json({
            code: 500,
            status: "false",
            message: "Internal server error",
            data: null,
        });
    }
}


// Get all customers with full details
export const getAllCustomerDetailsController = async (req, res) => {
  try {
    const data = await getAllCustomerDetailsModel();

    res.status(200).json({
      code: 200,
      success: true,
      message: 'Customer details retrieved successfully',
      data,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || 'Error fetching customer details',
    });
  }
};

// Delete a customer account
export const deleteCustomerAccountController = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await deleteCustomerAccountModel(userId);

    res.status(200).json({
      code: 200,
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || 'Error deleting customer account',
    });
  }
};


// Get wedding event details for a customer
export const getWeddingDashboardByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;

    const dashboardSummary = await getWeddingDashboardByUserIdModel(userId);

    // Always return 200 even if values are null
    res.status(200).json({
      code: 200,
      status: true,
      message: "Wedding dashboard summary fetched successfully",
      data: dashboardSummary,
    });
  } catch (error) {
    console.error("Controller Error (getWeddingDashboardByUserIdController):", error);
    res.status(500).json({
        code: 500,
        status: false,
        message: "Internal Server Error", error 
    });
  }
};



