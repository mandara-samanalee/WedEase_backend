import jwt from 'jsonwebtoken';
import {findUserByEmail} from "../models/user.model.js";

// login function
export const loginUser = async (req, res) => {
    try{
    const { email, password } =req.body;

    if(!email || !password) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: 'Email and password are required'
        })
    }

    const user = await findUserByEmail(email);

    if(!user) {
        return res.status(404).json({
            status: false,
            code: 404,
            message: "User not found"
        });
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) {
        return res.status(401).json({
            status: false,
            code: 401,
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign(
        { userId: user.userId, email: user.email, role: user.role }, 
        process.env.JWT_SECRET_KEY,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
        status: true,
        code: 200,
        message: "Login successful",
        user: {
            userId: user.userId,
            email: user.email,
            role: user.role,
        }
    })
} catch (error) {
    return res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error"
    });
}
}