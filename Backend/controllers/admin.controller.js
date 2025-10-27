const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                message: 'Please provide all required fields: name, email, password, role' 
            });
        }

        // Allow any valid role
        const validRoles = ['warden', 'clerk', 'security', 'student'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: `Invalid role specified: ${role}` });
        }
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with all required fields
        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role,
            institute: "GateGuard Institute",
            isEmailVerified: true // Auto verify for admin-created accounts
        });

        res.status(201).json({ 
            message: role === 'student' ? 'Student account created successfully' : 'Staff user created successfully', 
            user: newUser 
        });
    } catch (error) {
        console.error('Create user error:', error);
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

const deleteUser = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'super-admin') {
            return res.status(403).json({ message: 'Cannot delete super admin users' });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

module.exports = { createUser, getAllUsers, deleteUser };