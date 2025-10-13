import prisma from "../config/db.js";

// Create a review (only if booking is confirmed)
export const createReview = async (data) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: data.bookingId },
        });

        if (!booking) {
            throw new Error("Booking not found");
        }
        if (booking.customerId !== data.customerId) {
            throw new Error("Not allowed to review this booking");
        }
        if (booking.status !== "CONFIRMED") {
            throw new Error("Only confirmed bookings can be reviewed");
        }

        return prisma.review.create({
            data: {
                serviceId: data.serviceId,
                customerId: data.customerId,
                bookingId: data.bookingId,
                rating: data.rating,
                comment: data.comment,
            },
        });
    } catch (error) {
        throw new Error("Error creating review: " + error.message);
    }
};


// Update review
export const updateReview = async (id, customerId, data) => {
    try {
        const review = await prisma.review.findUnique({
            where: { id: Number(id) },
        });

        if (!review) {
            throw new Error("Review not found");
        }
        if (review.customerId !== customerId) {
            throw new Error("Not authorized to update this review");
        }

        return prisma.review.update({
            where: { id: Number(id) },
            data: {
                rating: data.rating,
                comment: data.comment,
            },
        });
    } catch (error) {
        throw new Error("Error updating review: " + error.message);
    }
};


// Delete review
export const deleteReview = async (id, customerId) => {
    try {
        const review = await prisma.review.findUnique({
            where: { id: Number(id) },
        });

        if (!review) {
            throw new Error("Review not found");
        }
        if (review.customerId !== customerId) {
            throw new Error("Not authorized to delete this review");
        }

        return prisma.review.delete({ 
            where: { id: Number(id) }, 
        });
    } catch (error) {
        throw new Error("Error deleting review: " + error.message);
    }
};


// Get reviews by Service ID
export const getReviews = async (serviceId) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { serviceId },
            orderBy: { createdAt: 'desc' }
        });
        return reviews;
    } catch (error) {
        throw new Error("Error fetching reviews: " + error.message);
    }
}