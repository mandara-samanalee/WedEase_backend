import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT tokens
//Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            status: false,
            code: 401,
            message: 'Access denied. No token provided.'
        });
    }

   // Validates the token, if valid, it decodes the token payload ({ userId, email, role }) & saves the decoded user data to req.user so it can be accessed in the next route/middleware. so user is authenticated, and you can now access req.user.userId, req.user.role, etc in your route.
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // contains userId, email, role
        next();
    } catch (error) {
        return res.status(403).json({
            status: false,
            code: 403,
            message: 'Invalid token.'
        });
    }
}