const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a unique userId manually
        const userId = Math.floor(10000 + Math.random() * 90000).toString();
        console.log('Generated userId manually:', userId);

        // Create a new user with the generated userId
        const user = await User.create({ name, email, password, role, userId });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                userId: user.userId, // Ensure userId is included in the response
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});




// Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check role mismatch
        if (role && user.role !== role) {
            return res.status(403).json({ 
                message: 'Access denied. Invalid role for this user.'
            });
        }
        
        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Generate JWT token with userId included
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,
                userId: user.userId // Include userId in token
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                userId: user.userId
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            name: user.name,
            email: user.email,
            role: user.role,
            userId: user.userId
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Test protected route (accessible by all authenticated users)
router.get('/protected', protect, (req, res) => {
    res.json({ 
        message: `Welcome ${req.user.role}`,
        userId: req.user.userId 
    });
});

// Test nurse-only route
router.get('/nurse-only', protect, authorize('nurse'), (req, res) => {
    res.json({ 
        message: 'Welcome Nurse!',
        userId: req.user.userId
    });
});

// Test patient-only route
router.get('/patient-only', protect, authorize('patient'), (req, res) => {
    res.json({ 
        message: 'Welcome Patient!',
        userId: req.user.userId
    });
});

router.get('/test', (req, res) => {
    res.send('Auth routes are working');
});

module.exports = router;