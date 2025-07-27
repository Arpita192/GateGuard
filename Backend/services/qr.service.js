const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

/**
 * Generates a JWT to be embedded in a QR code.
 * @param {object} payload - The data to include in the token (e.g., { passId, studentId }).
 * @param {string} expiresIn - The token's lifespan (e.g., '12h').
 * @returns {string} The generated JWT.
 */
const generateQRToken = (payload, expiresIn = '12h') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verifies a JWT from a scanned QR code.
 * @param {string} token - The token string from the QR code.
 * @returns {object|null} The decoded payload if valid, otherwise null.
 */
const verifyQRToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        // Handles expired or invalid tokens
        return null;
    }
};

module.exports = {
    generateQRToken,
    verifyQRToken,
};