const User = require('../models/User.model');
// We now need the ApprovalRequest model in this file
const ApprovalRequest = require('../models/ApprovalRequest.model');

// --- THIS FUNCTION HAS BEEN REWRITTEN ---
const updateUserProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded.' });
        }

        // Find the student who is uploading the picture
        const student = await User.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const newAvatarUrl = `/uploads/${req.file.filename}`;

        // Instead of updating the user directly, we now create an approval request
        await ApprovalRequest.create({
            student: student._id,
            oldAvatarUrl: student.avatarUrl, // Store the current picture
            newAvatarUrl: newAvatarUrl,     // Store the new picture
            status: 'pending'               // Set the status for the clerk to see
        });

        res.json({
            message: 'Profile picture submitted for approval.'
            // We no longer return the user object, as the picture hasn't been approved yet
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error while submitting profile picture.' });
    }
};


const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.employeeId = req.body.employeeId || user.employeeId;
            if (user.role === 'warden') {
                user.department = req.body.department || user.department;
            }
            user.roomNo = req.body.roomNo || user.roomNo;
            user.branch = req.body.branch || user.branch;
            user.batch = req.body.batch || user.batch;

            const updatedUser = await user.save();
            const userToReturn = updatedUser.toObject();
            delete userToReturn.password;
            res.json(userToReturn);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const searchStudents = async (req, res) => {
    try {
        const { branch, batch } = req.query;
        const filter = { role: 'student' };
        if (branch && branch !== 'All') filter.branch = branch;
        if (batch && batch !== 'All') filter.batch = batch;
        const students = await User.find(filter);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUniqueBranches = async (req, res) => {
    try {
        const branches = await User.distinct('branch', { role: 'student' });
        res.status(200).json(branches.filter(b => b));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUniqueBatches = async (req, res) => {
    try {
        const batches = await User.distinct('batch', { role: 'student' });
        res.status(200).json(batches.filter(b => b));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    updateUserProfilePicture,
    getUserProfile,
    updateUserProfile,
    searchStudents,
    getUniqueBranches,
    getUniqueBatches
};