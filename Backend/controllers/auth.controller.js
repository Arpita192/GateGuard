const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config');

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res) => {
    const { name, email, password, role, institute } = req.body;
    try {
        // Validate role
        const validRoles = ['student', 'clerk', 'warden', 'security', 'super-admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Check if institute is provided for admin
        if (role === 'super-admin' && !institute) {
            return res.status(400).json({ message: 'Institute name is required for admin account' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if admin already exists for this institute
        if (role === 'super-admin') {
            const existingAdmin = await User.findOne({ institute, role: 'super-admin' });
            if (existingAdmin) {
                return res.status(400).json({ message: 'An admin account already exists for this institute' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { register, login };