// Forgot password
// Compare new password with current hashed password
export const isSamePassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error(`Error comparing passwords: ${error.message}`);
    }
};

// Hash and update new password 
export const updateUserPassword = async (email, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.User.update({
            where: { email: email },
            data: { password: hashedPassword }
        });

        return { message: 'Password updated successfully.' };
    } catch (error) {
        throw new Error(`Error updating password: ${error.message}`);
    }
};

// change password
export const changePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
    try {
        if (newPassword !== confirmPassword) {
            return { 
                success: false, 
                message: 'New password and confirm password do not match.'
            };
        }

        if (newPassword === currentPassword) {
            return { 
                success: false, 
                message: 'New password cannot be the same as current password.' 
            };
        }

        const user = await prisma.User.findUnique({
            where: { userId: userId },
        });

        if (!user) {
            return { success: false, code: 400, message: 'User not found.' };
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return { success: false, code: 401, message: 'Current password is incorrect.' };
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.User.update({
            where: { userId: userId },
            data: { password: hashedNewPassword },
        });

        return { success: true, code: 200, message: 'Password updated successfully.' };
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, code: 500, message: 'Internal server error.' };
    }
};

// find user by email
export const findUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        return user;
    } catch (error) {
        throw new Error("Failed to find user by email");
    }
}