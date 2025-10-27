const express = require('express');
const router = express.Router();
const { getInstitutes, addInstitute } = require('../controllers/institute.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

router.get('/', getInstitutes);
router.post('/', protect, checkRole(['super-admin']), addInstitute);

module.exports = router;