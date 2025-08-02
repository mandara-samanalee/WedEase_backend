import { saveOtp,  findOtpById, deleteOtpById } from "../models/otp.model.js";
import { findUserByEmail } from '../models/user.model.js';
import MailService from '../services/email.service.js';
import { sendOtpEmail } from '../utils/emails/email.js';

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

        console.log(`OTP Generated for ${recipient}:`, otp);

        // prepare email
        const { subject, body } = sendOtpEmail(otp, recipient); 
        const mailService = new MailService(recipient, subject, body);

        const mailResponse = await mailService.sendEmail();
        if (!mailResponse) {
            return res.status(500).json({
                status: false,
                code: 500,
                error: 'Failed to send OTP email'
            });
        }

    return res.status(201).json({
        status: true,
        code: 201,
        message: `OTP has been successfully sent to ${recipient}`,
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
