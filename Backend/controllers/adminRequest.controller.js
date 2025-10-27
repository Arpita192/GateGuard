const AdminRequest = require('../models/AdminRequest.model');
const ApiError = require('../utils/ApiError');

const submitAdminRequest = async (req, res, next) => {
    try {
        const { name, instituteName, phoneNumber, email, note } = req.body;

        // Create new admin request
        const adminRequest = new AdminRequest({
            name,
            instituteName,
            phoneNumber,
            email,
            note
        });

        await adminRequest.save();

        res.status(201).json({
            success: true,
            message: 'Admin request submitted successfully',
            data: adminRequest
        });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
};

module.exports = {
    submitAdminRequest
};