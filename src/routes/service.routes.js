import { 
    createServiceController, getServicesByVendorIdController,
    changeServiceStatusController 
} from "../controllers/service.controller.js";
import { upload } from '../middleware/upload.js';
import express from 'express';

const router = express.Router();

router.post('/create', upload.array("photos"),createServiceController);
router.get('/getAll/:vendorId', getServicesByVendorIdController);
router.put("/status", changeServiceStatusController);

export default router;