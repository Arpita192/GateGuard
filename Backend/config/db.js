const mongoose = require('mongoose');
const config = require('./index');

mongoose.set('debug', true);

const connectDB = async () => {
    try {
        await mongoose.connect(config.DATABASE_URL);
        console.log('✅ Database connected successfully!');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;