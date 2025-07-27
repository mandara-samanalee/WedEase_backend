import { updateUserPassword, isSamePassword, changePassword } from '../models/user.model.js';
import { findUserByEmail } from '../models/customer.model.js';

// Controller function for Forgot password 
export const forgotPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: 'New password and confirm password are required.'
        });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: 'Passwords do not match.'
        });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: 'User not found.'
            });
        }

        const isSame = await isSamePassword(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({
                status: false,
                code: 400,
                message: 'New password cannot be your current password.'
            });
        }

        await updateUserPassword(email, newPassword);

        return res.status(200).json({
            status: true,
            code: 200,
            message: 'Password has been successfully reset'
        });

    } catch (error) {
        console.error('Error in forgotPassword:', error.message);
        return res.status(500).json({
            status: false,
            code: 500,
            message: 'Something went wrong while resetting the password.'
        });
    }
};

// change user password
export const changePasswordController = async (req, res) => {
    const { userId } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            code: 400,
            message: 'Current password, new password, and confirm password are required.',
        });
    }

    const result = await changePassword(userId, currentPassword, newPassword, confirmPassword);

    if (!result.success) {
        return res.status(400).json({ 
            code: 400,
            status: 'false',
            message: 'Failed to change password'});
    }

    return res.status(200).json({ 
        code: 200,
        status: 'true',
        message: 'Password changed successfully'});
};