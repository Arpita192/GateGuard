const express = require('express');
const router = express.Router();
const {
    createPassRequest,
    getPendingRequests,
    handlePassAction,
    getAllStudentPasses,
    getAllPasses,
    getPassesByStudentid
} = require('../controllers/pass.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');


router.post('/request', protect, checkRole(['student']), createPassRequest);
router.get('/student/all', protect, checkRole(['student']), getAllStudentPasses);
router.get('/warden/pending-requests', protect, checkRole(['warden']), getPendingRequests);
router.post('/warden/requests/:id/:action', protect, checkRole(['warden']), handlePassAction);
router.get('/all', protect, checkRole(['warden', 'clerk']), getAllPasses);
router.get('/student/:studentId', protect, checkRole(['warden', 'clerk']), getPassesByStudentid);

module.exports = router;