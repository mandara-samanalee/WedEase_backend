import {
    updateAdminProfileModel,
    GetAdminProfileModel,
    getDashboardSummaryModel,
    getRecentRegistrationsModel,
    getServiceCountsByCategoryModel,
    getTopBookedServicesModel,
    getTopRatedServicesModel
} from "../models/admin.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Update Admin Profile Controller
export const updateAdminProfileController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, email, contactNo } = req.body;

        let imageUrl;

        // If a new profile image is uploaded, handle Cloudinary upload
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "wedease_images",
                        resource_type: "image",
                        public_id: `profile_${userId}`,
                        overwrite: true,
                    },
                    (error, result) => {
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

        // Prepare update data
        const updatedData = {
            firstName,
            lastName,
            email,
            contactNo,
            designation: "System Administrator",
            image: imageUrl,
        };

        const updatedAdmin = await updateAdminProfileModel(userId, updatedData);

        return res.status(200).json({
            code: 200,
            status: "true",
            message: "Admin profile updated successfully",
            data: updatedAdmin,
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        return res.status(500).json({
            code: 500,
            status: "false",
            message: "Internal server error",
            data: null,
        });
    }
};


// Get admin details
export const getAdminProfileController = async (req, res) => {
    try {
        const { userId } = req.params;

        const Admin = await GetAdminProfileModel(userId);
        if (!Admin) {
            return res.status(404).json({
                code: 404,
                status: "false",
                message: "Admin not found",
                data: null,
            });
        }

        return res.status(200).json({
            code: 200,
            status: "true",
            message: "Admin details retrieved successfully",
            data: Admin,
        });
    } catch (error) {
        console.error("Error retrieving admin details:", error);
        return res.status(500).json({
            code: 500,
            status: "false",
            message: "Internal server error",
            data: null,
        });
    }
} 


// get dashboard overview counts
export const getDashboardSummaryController = async (req, res) => {
  try {
    const summary = await getDashboardSummaryModel();

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Dashboard summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: error.message || 'Failed to fetch dashboard summary',
    });
  }
};


// get newly registered customers and vendors in past three months
export const getRecentRegistrationsController = async (req, res) => {
  try {
    const summary = await getRecentRegistrationsModel();

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'New registrations retrieved successfully for the past 3 months',
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: error.message || 'Failed to fetch recent registrations',
    });
  }
};


// get the service count under each service category
export const getServiceCountsByCategoryController = async (req, res) => {
  try {
    const data = await getServiceCountsByCategoryModel();

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Service counts by category retrieved successfully',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: error.message || 'Failed to fetch service counts by category',
    });
  }
};


// get the most booked services
export const getTopBookedServicesController = async (req, res) => {
  try {
    const data = await getTopBookedServicesModel();

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Top 3 most booked services retrieved successfully',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: error.message || 'Failed to fetch top booked services',
    });
  }
};


// get the top rated services
export const getTopRatedServicesController = async (req, res) => {
  try {
    const data = await getTopRatedServicesModel();

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Top rated services retrieved successfully',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: error.message || 'Failed to fetch top rated services',
    });
  }
};
