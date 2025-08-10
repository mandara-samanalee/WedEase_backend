import { 
    createVendorModel, 
    updateVendorProfileModel 
} from "../models/vendor.model.js";
import { findUserByEmail } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

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


// update vendor profile
export const updateVendorProfileController = async (req, res) => {
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

        const updatedVendor = await updateVendorProfileModel(userId, updatedData);

        return res.status(200).json({
            code: 200,
            status: "true",
            message: "Profile updated successfully",
            data: updatedVendor,
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