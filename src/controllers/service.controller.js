import {
    createService,
    getServicesByVendorId,
    updateServiceStatus,
    getAllServices,
    getServiceById,
    deleteServiceModel
} from "../models/service.model.js";

// Controller to handle service creation
export const createServiceController = async (req, res) => {
    try {
        const service = await createService(req.body, req.files);
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
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Services fetched successfully",
            data: services
        });
    } catch (error) {
        console.error("Error fetching services by vendorId:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to fetch services",
            error: error.message
        });
    }
};


// Change service status
export const changeServiceStatusController = async (req, res) => {
    try {
        const { serviceId, isActive } = req.body;

        if (!serviceId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "serviceId is required",
            });
        }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "isActive must be true or false",
            });
        }

        const updatedService = await updateServiceStatus(serviceId, isActive);
        return res.status(200).json({
            code: 200,
            success: true,
            message: `Service status updated to ${isActive ? "active" : "inactive"}`,
            data: updatedService,
        });
    } catch (error) {
        console.error("Error updating service status:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// get all services
export const getAllServicesController = async (req, res) => {
    try {
        const services = await getAllServices();

        return res.status(200).json({
            code: 200,
            success: true,
            message: "All services fetched successfully",
            data: services
        });
    } catch (error) {
        console.error("Error fetching all services:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to fetch services",
            error: error.message
        });
    }
};

// Get service by serviceId controller
export const getServiceByIdController = async (req, res) => {
    try {
        const { serviceId } = req.body;
        if (!serviceId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "serviceId is required"
            });
        }
        const service = await getServiceById(serviceId);
        if (!service) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "Service not found"
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Service fetched successfully",
            data: service
        });
    } catch (error) {
        console.error("Error fetching service by serviceId:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to fetch service",
            error: error.message
        });
    }
};


// Delete service controller
export const deleteServiceController = async (req, res) => {
    try {
        const { serviceId } = req.body;

        if (!serviceId) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: "Service ID is required in the request body",
            });
        }

        const result = await deleteServiceModel(serviceId);

        if (!result.status) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: result.data,
            });
        }
        return res.status(200).json({
            status: true,
            code: 200,
            message: result.data
        });
    } catch (error) {
        console.error("Error in deleteServiceController:", error);
        return res.status(500).json({
            status: false,
            code: 500,
            message: "Internal server error",
        });
    }
};
