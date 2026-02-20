const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            if (!user.active) return res.status(403).json({ message: 'User is inactive' });

            res.json({
                id: user._id,
                username: user.username,
                name: user.name,
                role: user.role,
                branch: user.branch,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Seed default admin (Idempotent - updates if exists to ensure hashed password)
router.post('/seed', async (req, res) => {
    try {
        let admin = await User.findOne({ username: 'admin' });

        if (!admin) {
            admin = new User({
                username: 'admin',
                password: 'demo123',
                name: 'Admin User',
                role: 'admin'
            });
        } else {
            // Update password to ensure it is hashed (triggers pre-save hook)
            admin.password = 'demo123';
        }

        await admin.save();
        res.json({ message: 'Admin seeded/updated successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user credentials
router.put('/update', async (req, res) => {
    const { name, username, newName, newUsername, newPassword, newBranch } = req.body;

    try {
        let query = {};
        if (username) query.username = username;
        else if (name) query.name = name;
        else return res.status(400).json({ message: 'Please provide username or name to identify user' });

        const user = await User.findOne(query);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (newName) user.name = newName;
        if (newUsername) user.username = newUsername;
        if (newPassword) user.password = newPassword; // Pre-save hook will hash this
        if (newBranch) user.branch = newBranch;

        await user.save();
        res.json({
            message: `Profile updated for ${user.name}`,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                role: user.role,
                branch: user.branch
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reset password (requires master secret)
router.post('/reset-password', async (req, res) => {
    const { username, newPassword, adminSecret } = req.body;

    // Hardcoded master secret for recovery (In production, use env var)
    const MASTER_SECRET = process.env.MASTER_SECRET || 'trust-pos-master';

    if (adminSecret !== MASTER_SECRET) {
        return res.status(403).json({ message: 'Invalid Admin Secret' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = newPassword || 'demo123';
        await user.save();

        res.json({ message: `Password reset successfully for ${username}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
