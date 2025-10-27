const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    code: { 
        type: String, 
        required: true, 
        unique: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Institute = mongoose.model('Institute', instituteSchema);

module.exports = Institute;