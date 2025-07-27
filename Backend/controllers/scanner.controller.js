const Pass = require('../models/Pass.model');

const verifyPass = async (req, res) => {
    const { passId } = req.body;
    try {
        const pass = await Pass.findById(passId).populate('student');
        if (!pass) {
            return res.status(404).json({ valid: false, message: 'Pass not found.' });
        }
        res.status(200).json({ valid: true, pass });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const recordExit = async (req, res) => {
    const { passId } = req.body;
    try {
        const pass = await Pass.findById(passId);
        if (!pass) return res.status(404).json({ message: 'Pass not found.' });
        if (pass.status !== 'Approved') return res.status(400).json({ message: `Pass is ${pass.status}, not 'Approved'.` });
        pass.status = 'Active';
        pass.actualExitTime = new Date();
        await pass.save();
        res.status(200).json({ success: true, message: 'Student Exit Recorded.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const recordEntry = async (req, res) => {
    const { passId } = req.body;
    try {
        const pass = await Pass.findById(passId);
        if (!pass) return res.status(404).json({ message: 'Pass not found.' });
        if (pass.status !== 'Active') return res.status(400).json({ message: `Pass is ${pass.status}, not 'Active'.` });
        pass.status = 'Completed';
        pass.actualEntryTime = new Date();
        await pass.save();
        res.status(200).json({ success: true, message: "Student Entry Recorded." });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { verifyPass, recordExit, recordEntry };