import {
    createReview,
    updateReview,
    deleteReview,
    getReviews
} from "../models/review.model.js";

// Create a review
export const createReviewController = async (req, res) => {
    try {
        const { serviceId, customerId, bookingId, rating, comment } = req.body;

        const review = await createReview({
            serviceId,
            customerId,
            bookingId,
            rating,
            comment,
        });

        return res.status(201).json({
            code: 201,
            success: true,
            message: "Review created successfully",
            data: review,
        });
    } catch (error) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: "Failed to create review",
            error: error.message,
        });
    }
};

// Update review
export const updateReviewController = async (req, res) => {
    try {
        const { id } = req.params;
        const customerId = req.body.customerId;
        const { rating, comment } = req.body;

        if (!id) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Review ID is required",
            });
        }
        const review = await updateReview(id, customerId, {
            rating,
            comment,
        });

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Review updated successfully",
            data: review,
        });
    } catch (error) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: "Failed to update review",
            error: error.message,
        });
    }
};

// Delete review
export const deleteReviewController = async (req, res) => {
    try {
        const { id } = req.params;
        const customerId = req.body.customerId;

        if (!id) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Review ID is required",
            });
        }

        await deleteReview(id, customerId);

        res.status(200).json({
            code: 200,
            success: true,
            message: "Review deleted successfully",
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            code: 400,
            success: false,
            message: "Failed to delete review",
            error: error.message,
        });
    }
};


// Get reviews by serviceId
export const getReviewsByServiceIdController = async (req, res) => {
    try {
        const { serviceId } = req.body;
        if (!serviceId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Service ID is required",
            });
        }
        const reviews = await getReviews
        (serviceId);

        if (!reviews || reviews.length === 0) {
            return res.status(200).json({
                code: 200,
                success: true,
                message: "No reviews found for this service",
                data: [],
            });
        }

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Reviews fetched successfully",
            data: reviews,
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


