const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/api/iden/user/:id', controller.getUser)
router.get('/api/iden/test', controller.test)

module.exports = router;