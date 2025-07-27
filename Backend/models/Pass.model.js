const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Active', 'Completed', 'Overdue'], default: 'Pending' },
    reason: { type: String, required: true },
    passType: { type: String, enum: ['same-day', 'overnight'], required: true },
    departureDate: { type: Date, required: true },
    departureTime: { type: String, required: true },
    returnDate: { type: Date },
    returnTime: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actualExitTime: { type: Date },
    actualEntryTime: { type: Date },
}, { timestamps: true });

const Pass = mongoose.model('Pass', passSchema);

module.exports = Pass;