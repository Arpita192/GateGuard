const mongoose = require('mongoose');
const Institute = require('../models/Institute.model');
require('dotenv').config();

const initializeInstitute = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if BIT Mesra already exists
        const existingInstitute = await Institute.findOne({ name: 'BIT, Mesra' });
        
        if (!existingInstitute) {
            // Create BIT Mesra institute
            await Institute.create({
                name: 'BIT, Mesra',
                code: 'BITM',
                address: 'Mesra, Ranchi, Jharkhand 835215',
                isActive: true
            });
            console.log('✅ BIT, Mesra institute created successfully');
        } else {
            console.log('ℹ️ BIT, Mesra institute already exists');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the initialization
initializeInstitute();