import express from 'express';
import {
    updateAdminProfileController,
    getAdminProfileController,
    getDashboardSummaryController,
    getRecentRegistrationsController,
    getServiceCountsByCategoryController,
    getTopBookedServicesController,
    getTopRatedServicesController
} from "../controllers/admin.controller.js";
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.put("/update-profile/:userId", upload.single('image'), updateAdminProfileController);
router.get("/getdetails/:userId", getAdminProfileController);
// get customer, vendor, booking, event. services count
router.get("/summary/counts", getDashboardSummaryController);
// get newly registered customers and vendors in past three months
router.get("/monthly-registrations", getRecentRegistrationsController);
// get the service count under each service category
router.get("/service-counts", getServiceCountsByCategoryController);
// get the most booked services
router.get('/top-booked-services', getTopBookedServicesController);
// get the top rated services
router.get('/top-rated-services', getTopRatedServicesController);

export default router;
