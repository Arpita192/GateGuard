const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { checkRole } = require('../middleware/role.middleware');
const { protect } = require('../middleware/auth.middleware');

// Only admin can register new users
router.post('/register', protect, checkRole(['admin']), register);
router.post('/login', login);

module.exports = router;