const Institute = require('../models/Institute.model');

// Get all institutes
const getInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.find({ isActive: true }).select('name code');
        res.json(institutes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching institutes', error: error.message });
    }
};

// Add new institute
const addInstitute = async (req, res) => {
    try {
        const { name, code, address } = req.body;
        const institute = await Institute.create({
            name,
            code,
            address
        });
        res.status(201).json(institute);
    } catch (error) {
        res.status(400).json({ message: 'Error adding institute', error: error.message });
    }
};

module.exports = {
    getInstitutes,
    addInstitute
};