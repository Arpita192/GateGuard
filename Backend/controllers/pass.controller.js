const Pass = require('../models/Pass.model');

const createPassRequest = async (req, res) => {
    try {
        const { reason, passType, departureDate, departureTime, returnDate, returnTime } = req.body;
        const newPass = await Pass.create({
            student: req.user.id,
            reason,
            passType,
            departureDate,
            departureTime,
            returnDate,
            returnTime,
            status: 'Pending'
        });
        res.status(201).json(newPass);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating pass', error: error.message });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const requests = await Pass.find({ status: 'Pending' }).populate('student', 'name roomNo avatarUrl');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const handlePassAction = async (req, res) => {
    const { id, action } = req.params;
    try {
        const pass = await Pass.findById(id);
        if (!pass) return res.status(404).json({ message: 'Pass not found' });
        if (action === 'approve') pass.status = 'Approved';
        else if (action === 'reject') pass.status = 'Rejected';
        else return res.status(400).json({ message: 'Invalid action' });
        pass.approvedBy = req.user.id;
        await pass.save();
        res.status(200).json({ message: `Pass ${action}d successfully.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllStudentPasses = async (req, res) => {
    try {
        const allPasses = await Pass.find({ student: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(allPasses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllPasses = async (req, res) => {
    try {
        const allPasses = await Pass.find({}).populate('student', 'name roomNo').sort({ createdAt: -1 });
        res.status(200).json(allPasses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getPassesByStudentid = async (req, res) => {
    try {
        const passes = await Pass.find({ student: req.params.studentId }).sort({ createdAt: -1 });
        res.status(200).json(passes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createPassRequest,
    getPendingRequests,
    handlePassAction,
    getAllStudentPasses,
    getAllPasses,
    getPassesByStudentid
};