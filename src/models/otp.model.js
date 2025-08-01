import prisma from "../config/db.js";
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = 5;

// Generate and save otp
export const saveOtp = async (recipient) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); 
    const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // delete any existing OTP for the recipient
    await prisma.otp.deleteMany({
        where: { recipient },
        expiresAt: {
            gte: new Date() 
        }
    });

    const savedOtp = await prisma.otp.create({
        data: {
            recipient,
            otp: hashedOtp,
            type: "email",
            expiresAt,
        },
    })

    return { otp, savedOtp};
};


// find otp by id
export const  findOtpById = async (otpId) => {
    return await prisma.otp.findUnique({
        where: { id: otpId },
    });
}

//delete otp by id
export const deleteOtpById = async (otpId) => {
    return await prisma.otp.delete({
        where: { id: otpId },
    });
}