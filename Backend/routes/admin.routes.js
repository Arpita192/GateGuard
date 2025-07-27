const express = require('express');
const router = express.Router();
const { createStaffUser, getAllUsers } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

router.use(protect, checkRole(['super-admin']));
router.post('/users', createStaffUser);
router.get('/users', getAllUsers);

module.exports = router;