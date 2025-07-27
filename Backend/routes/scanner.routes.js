const express = require('express');
const router = express.Router();
const { verifyPass, recordExit, recordEntry } = require('../controllers/scanner.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

router.use(protect, checkRole(['security']));
router.post('/verify', verifyPass);
router.post('/exit', recordExit);
router.post('/entry', recordEntry);

module.exports = router;