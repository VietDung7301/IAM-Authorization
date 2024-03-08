const express = require('express');
const router = express.Router();
const controller = require('./controller');
const cors = require('cors');

const corsOptions = {
    origin: [process.env.ACCESS_URL],
}

router.post('/api/auth/code', controller.AuthCodeGrant)
router.post('/api/auth/token', controller.TokenGrant)
router.post('/api/auth/client', controller.ClientRegistration)
router.post('/api/auth/logout', controller.Logout)
router.get('/api/auth/public_key', cors(corsOptions), controller.getPublicKey)     //them cors
router.get('/api/auth/test', controller.Test)

module.exports = router;