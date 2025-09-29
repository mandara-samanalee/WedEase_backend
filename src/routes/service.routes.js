import { 
    createServiceController, 
    getServicesByVendorIdController,
    changeServiceStatusController,
    getAllServicesController,
    getServiceByIdController
} from "../controllers/service.controller.js";
import { upload } from '../middleware/upload.js';
import express from 'express';

const router = express.Router();

router.post('/create', upload.array("photos"),createServiceController);
router.get('/getAll/:vendorId', getServicesByVendorIdController);
router.put("/status", changeServiceStatusController);
router.get("/all", getAllServicesController);
router.post("/get-details", getServiceByIdController);

export default router;