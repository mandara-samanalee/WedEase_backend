import express from 'express';
import {
    createOrUpdateBookingController,
    getBookingsByCustomerIdController,
    updateBookingStatusController,
    deleteBookingController,
    getVendorBookingsController
} from '../controllers/booking.controller.js';

const router = express.Router();

// Create or update booking
router.post('/create', createOrUpdateBookingController);

// Get bookings by customerId
router.get('/customer/:customerId', getBookingsByCustomerIdController);

// Update booking status
router.put('/update-status', updateBookingStatusController);

// Delete booking by ID
router.delete('/delete/:id', deleteBookingController);

// Get bookings by vendorId
router.get('/vendor/:vendorId', getVendorBookingsController);

export default router;