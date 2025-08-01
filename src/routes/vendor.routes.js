import express from 'express';
import { createVendorController } from '../controllers/vendor.controller.js';

const router = express.Router();

router.post('/create', createVendorController);

export default router;