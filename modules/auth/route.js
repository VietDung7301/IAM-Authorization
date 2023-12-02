const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/api/auth/code', controller.AuthCodeGrant)
router.post('/api/auth/token', controller.TokenGrant)

module.exports = router;