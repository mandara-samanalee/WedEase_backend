import { createServiceModel, getServicesByVendorId } from "../models/service.model.js";

// Controller to handle service creation
export const createServiceController = async (req, res) => {
    try {
        const service = await createServiceModel(req.body, req.files);
        return res.status(201).json({
            code: 201,
            success: true,
            message: "Service created successfully",
            data: service
        });
    } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// controller for get all services
export const getServicesByVendorIdController = async (req, res) => {
    try {
        const { vendorId } = req.params;

        if (!vendorId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "vendorId is required"
            });
        }
        const services = await getServicesByVendorId(vendorId);

        if (!services || services.length === 0) {
            return res.status(200).json({
                code: 200,
                success: true,
                message: "No services found for this vendor"
            });
        }
        return res.status(200).json(services);
    } catch (error) {
        console.error("Error fetching services by vendorId:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to fetch services", error: error.message
        });
    }
};