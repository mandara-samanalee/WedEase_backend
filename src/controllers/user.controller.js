import { 
    updateUserPassword, 
    isSamePassword, 
    changePassword,  
    findUserByEmail,
    deleteUserAccountModel
} from '../models/user.model.js';

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


// delete user account
export const deleteUserAccountController = async (req, res) => {
    const { userId } = req.params;
    
    try {
        if (!userId) {
            return res.status(400).json({
                code: 400,
                status: "false",
                message: "User ID is required",
            });
        }

        const result = await deleteUserAccountModel(userId);

        return res.status(200).json({
            code: 200,
            status: "true",
            message: "User account deleted successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error in deleteUserAccountController:", error);
        return res.status(500).json({
            code: 500,
            status: "false",
            message: "Internal server error",
            data: null,
        });
    }
}

// get user by email
export const getUserByEmailController = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                status: false,
                code: 404,
                message: 'User not found.'
            });
        }
        return res.status(200).json({
            status: true,
            code: 200,
            message: 'User found.',
            data: user
        });
    }
    catch (error) {
        console.error('Error in getUserByEmailController:', error.message);
        return res.status(500).json({
            status: false,
            code: 500,
            message: 'Something went wrong while fetching the user.'
        });
    }
}