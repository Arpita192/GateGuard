const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, deleteUser } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

router.use(protect, checkRole(['super-admin']));
router.post('/users', createUser);
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);

module.exports = router;