const express = require('express');
const router = express.Router();
const { getPendingPhotoApprovals, handlePhotoApproval, getApprovalHistory, getHistoryByStudentid } = require('../controllers/approval.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

router.use(protect, checkRole(['clerk', 'warden']));
router.get('/pending', getPendingPhotoApprovals);
router.get('/history', getApprovalHistory);
router.post('/:id', handlePhotoApproval);
router.get('/history/:studentid', getHistoryByStudentid);

module.exports = router;