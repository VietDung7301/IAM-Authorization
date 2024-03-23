const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/api/iden/user/:id', controller.getUser)
router.post('/api/iden/user/authen', controller.authenticateUser)
router.get('/api/iden/test', controller.test)

module.exports = router;