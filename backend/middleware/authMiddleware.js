const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
const protect = async (req, res, next) => {
    let token;

    // Check if the token exists in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

            // Attach user to request object
            req.user = await User.findById(decoded.id).select('-password'); // Exclude password
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Role-Based Authorization
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized for this role' });
        }
        next();
    };
};

// userSchema.pre('save', async function (next) {
//     // Only generate userId if it's a new document
//     if (this.isNew) {
//         this.userId = await generateUniqueUserId.call(this); // Bind this to the current document
//     }
//     next();
// });



module.exports = { protect, authorize };
