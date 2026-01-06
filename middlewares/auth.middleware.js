const {asyncHandler} = require('../utils/asyncHandler');
const User=require('../models/user.model');
const jwt = require('jsonwebtoken');

const registerMiddleware = asyncHandler(async (req, res, next) => {
    console.log('Register middleware executed');
    const { username,email, password ,confirmPassword} = req.body;
    if(!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if(password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    if(password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    next();
});

const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.authToken || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No authentication token found' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            console.log('User not found for the provided token');
            return res.status(401).json({ message: 'Invalid authentication token' });
        }
        req.user = user;
        next();
    } catch (error) {
        throw new Error("Login middleware error");
    }

});
    
exports.verifyJwt = verifyJwt;
exports.registerMiddleware = registerMiddleware;