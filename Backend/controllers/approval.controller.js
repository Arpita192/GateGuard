const User = require('../models/User.model');
const ApprovalRequest = require('../models/ApprovalRequest.model');

const getPendingPhotoApprovals = async (req, res) => {
    try {
        const approvals = await ApprovalRequest.find({ status: 'pending' }).populate('student', 'name roomNo branch batch avatarUrl');
        res.status(200).json(approvals);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getApprovalHistory = async (req, res) => {
    try {
        const history = await ApprovalRequest.find({ status: { $ne: 'pending' } })
            .populate('student', 'name')
            .populate('reviewedBy', 'name')
            .sort({ updatedAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const handlePhotoApproval = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const request = await ApprovalRequest.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        request.status = status;
        request.reviewedBy = req.user.id;
        if (status === 'approved') {
            await User.findByIdAndUpdate(request.student, { avatarUrl: request.newAvatarUrl });
        }
        await request.save();
        res.status(200).json({ message: `Photo update has been ${status}.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getHistoryByStudentid = async (req, res) => {
    try {
        const history = await ApprovalRequest.find({ student: req.params.studentid })
            .populate('reviewedBy', 'name')
            .sort({ updatedAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getPendingPhotoApprovals,
    handlePhotoApproval,
    getApprovalHistory,
    getHistoryByStudentid
};