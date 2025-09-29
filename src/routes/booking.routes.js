import express from 'express';
import {
    createOrUpdateBookingController,
    getBookingsByCustomerIdController,
    updateBookingStatusController
} from '../controllers/booking.controller.js';

const router = express.Router();

// Create or update booking
router.post('/create', createOrUpdateBookingController);

// Get bookings by customerId
router.get('/customer/:customerId', getBookingsByCustomerIdController);

// Update booking status
router.put('/update-status', updateBookingStatusController);

export default router;