const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // --- Common Fields for All Users ---
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    institute: { type: String, required: true, default: "GateGuard Institute" },
    role: {
        type: String,
        required: true,
        enum: ['student', 'warden', 'security', 'clerk', 'super-admin'],
        default: 'student',
    },
    avatarUrl: { type: String, default: 'https://i.imgur.com/default-avatar.png' },

    // --- NEW: Staff-Specific Fields ---
    phone: { type: String }, // For all staff
    employeeId: { type: String }, // For all staff
    department: { type: String }, // For Warden only

    // --- Student-Specific Fields ---
    roomNo: { type: String },
    branch: { type: String },
    batch: { type: String },
    
}, { timestamps: true });

// Add compound index for institute and admin role
userSchema.index(
    { institute: 1, role: 1 },
    { 
        unique: true,
        partialFilterExpression: { role: 'super-admin' }
    }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
