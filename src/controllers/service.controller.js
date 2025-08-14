import { createServiceModel } from "../models/service.model.js";

// Controller to handle service creation
export const createServiceController = async (req, res) => {
    try {
        const service = await createServiceModel(req.body, req.files);
        return res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: service
        });

    } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Internal server error"
        });
    }
};
