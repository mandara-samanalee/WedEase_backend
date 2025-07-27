import { saveOtp,  findOtpById, deleteOtpById } from "../models/otp.model.js";
import { findUserByEmail } from '../models/user.model.js';

// Generate otp
export const createOtp = async (req, res) => {
    try {
        const recipient = req.header('recipient');

        if (!recipient) {
            return res.status(400).json({
                status: false,
                code: 400,
                error: 'Recipient header is required' });
        }

            const user = await findUserByEmail (recipient);
            if (!user) {
                return res.status(400).json({
                    status: false,
                    code: 400,
                    message: "recipient not registered"
                });
            }

        const { otp, savedOtp } = await saveOtp(recipient);

        console.log("OtP id:",savedOtp.otpId, "OTP:",otp); 

    return res.status(201).json({
        status: true,
        code: 201,
        message: `OTP has been generated successfully for ${recipient}`,
        otpId: savedOtp.id, 
    });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({
            status: false,
            code: 500,
            error: 'Internal server error',
        });
    }
};

// verify otp
export const verifyOtp = async (req,res) => {
    try {
        const { otpId, otp } = req.body;

        if (!otpId || !otp) {
            return res.status(400).json({
                status: false,
                code: 400,
                error: 'OTP ID and OTP are required'
            });
        }

        const otpRecord = await findOtpById(otpId);

        if (!otpRecord) {
            return res.status(404).json({
                status: false,
                code: 404,
                error: 'Invalid or expired OTP'
            });
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if(!isMatch) {
            return res.status(401).json({
                status: false,
                code: 401,
                message: "OTP mismatched"
            });
        } 
        await deleteOtpById(otpId);

        return res.status(200).json({
            status: true,
            code: 200,
            message: "OTP verified successfully",
            recipient: otpRecord.recipient
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            status: false,
            code: 500,
            message: "Internal server error",
        });
    }
    };
