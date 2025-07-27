const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

const createStaffUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!['warden', 'clerk', 'security'].includes(role)) {
            return res.status(400).json({ message: 'Invalid staff role specified' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json({ message: 'Staff user created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createStaffUser, getAllUsers };