const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    updateUserProfilePicture,
    searchStudents,
    getUniqueBranches,
    getUniqueBatches
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

// --- Routes for user profile (accessible by any logged-in user) ---
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post('/profile/picture', protect, upload.single('avatar'), updateUserProfilePicture);

// --- Routes for searching students (accessible only by warden and clerk) ---
// Corrected 'check-role' to 'checkRole' in the lines below
router.get('/students/search', protect, checkRole(['warden', 'clerk']), searchStudents);
router.get('/branches', protect, checkRole(['warden', 'clerk']), getUniqueBranches);
router.get('/batches', protect, checkRole(['warden', 'clerk']), getUniqueBatches);

module.exports = router;