const mongoose = require('mongoose');

const approvalRequestSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    oldAvatarUrl: { type: String, required: true },
    newAvatarUrl: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const ApprovalRequest = mongoose.model('ApprovalRequest', approvalRequestSchema);

module.exports = ApprovalRequest;