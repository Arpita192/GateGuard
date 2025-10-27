const express = require('express');
const { submitAdminRequest } = require('../controllers/adminRequest.controller');
const router = express.Router();

router.post('/submit', submitAdminRequest);

module.exports = router;