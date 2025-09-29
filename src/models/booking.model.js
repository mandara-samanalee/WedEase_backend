import prisma from "../config/db.js";

// Create or update booking
export const createOrUpdateBooking = async (serviceId, customerId, status) => {
    try {
        // Check if booking already exists
        const existingBooking = await prisma.booking.findFirst({
            where: {
                serviceId,
                customerId,
            }
        });

        let booking;

        if (existingBooking) {
            // Update existing booking status
            booking = await prisma.booking.update({
                where: { id: existingBooking.id },
                data: {
                    status,
                    updatedAt: new Date(),
                }
            });
        } else {
            // Create new booking
            booking = await prisma.booking.create({
                data: {
                    serviceId,
                    customerId,
                    status,
                }
            });
        }

        return booking;
    } catch (error) {
        throw new Error("Error creating/updating booking: " + error.message);
    }
};

// Get bookings by customerId
export const getBookingsByCustomerId = async (customerId) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { customerId },
            include: {
                service: {
                    include: {
                        vendor: true,
                        photos: true,
                        packages: true,
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        return bookings;
    } catch (error) {
        throw new Error("Error fetching bookings by customerId: " + error.message);
    }
};


// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
    try {
        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status,
                updatedAt: new Date(),
                ...(status === 'CONFIRMED' && { confirmedAt: new Date() }),
                ...(status === 'CANCELLED' && { cancelledAt: new Date() })
            }
        });
        return booking;
    } catch (error) {
        throw new Error("Error updating booking status: " + error.message);
    }
};