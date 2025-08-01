import { createOtp, verifyOtp } from "../controllers/otp.controller.js";
import express from "express";

const router = express.Router();

router.get("/otp/send", createOtp);
router.post("/otp/verify", verifyOtp);

export default router;