import {
    createOrUpdateBooking,
    getBookingsByCustomerId,
    updateBookingStatus,
    deleteBookingById,
    getVendorBookings
} from '../models/booking.model.js';

// Create or update booking controller
export const createOrUpdateBookingController = async (req, res) => {
    try {
        const { serviceId, customerId, status } = req.body;

        // Validate required fields
        if (!serviceId || !customerId || !status) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "serviceId, customerId, and status are required"
            });
        }

        // Validate status
        const validStatuses = ['INTERESTED', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Invalid status. Must be one of: INTERESTED, PENDING, CONFIRMED, CANCELLED, COMPLETED"
            });
        }

        const booking = await createOrUpdateBooking(serviceId, customerId, status);

        return res.status(200).json({
            code: 200,
            success: true,
            message: `Service ${status.toLowerCase()} successfully`,
            data: booking
        });
    } catch (error) {
        console.error("Error creating/updating booking:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to process booking",
            error: error.message
        });
    }
};

// Get bookings by customerId controller
export const getBookingsByCustomerIdController = async (req, res) => {
    try {
        const { customerId } = req.params;

        if (!customerId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "customerId is required"
            });
        }

        const bookings = await getBookingsByCustomerId(customerId);

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Bookings fetched successfully",
            data: bookings
        });
    } catch (error) {
        console.error("Error fetching bookings by customerId:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};


// Update booking status controller
export const updateBookingStatusController = async (req, res) => {
    try {
        const { bookingId, status } = req.body;

        if (!bookingId || !status) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "bookingId and status are required"
            });
        }

        // Validate status
        const validStatuses = ['INTERESTED', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Invalid status. Must be one of: INTERESTED, PENDING, CONFIRMED, CANCELLED, COMPLETED"
            });
        }

        const booking = await updateBookingStatus(bookingId, status);

        return res.status(200).json({
            code: 200,
            success: true,
            message: `Booking status updated to ${status.toLowerCase()} successfully`,
            data: booking
        });
    } catch (error) {
        console.error("Error updating booking status:", error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to update booking status",
            error: error.message
        });
    }
};


// delete booking
export const deleteBookingController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Booking ID is required",
            });
        }

        const deletedBooking = await deleteBookingById(id);

        return res.status(200).json({
            success: true,
            message: "Booking deleted successfully",
            data: deletedBooking,
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Failed to delete booking",
            error: error.message,
        });
    }
};


// get all bookings by vendorId
export const getVendorBookingsController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const services = await getVendorBookings(vendorId);

    if (!services || services.length === 0) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: "No services or bookings found for this vendor",
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      message: "Vendor bookings fetched successfully",
      data: services,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      success: false,
      message:" Failed to fetch vendor bookings", 
      error: error.message,
    });
  }
};
