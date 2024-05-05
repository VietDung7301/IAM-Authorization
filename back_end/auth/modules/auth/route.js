const express = require('express');
const router = express.Router();
const controller = require('./controller');
const cors = require('cors');
const codeReqValidation = require('./middlewares/CodeReqValidation')
const userValidation = require('./middlewares/UserValidation')
const clientValidation = require('./middlewares/ClientValidation')
const clientAuthentication = require('./middlewares/ClientAuthentication')
const tokenAuthentication = require('./middlewares/TokenAuthentication')
const otpValidation = require('./middlewares/OtpValidation')

const corsOptions = {
    origin: [process.env.ACCESS_URL],
}

router.post('/api/auth/code', [codeReqValidation.Handle, userValidation.Handle, clientValidation.Handle], controller.AuthCodeGrant)
router.post('/api/auth/code/otp', [otpValidation.Handle], controller.AuthCodeGrantByOtp)
router.post('/api/auth/token', [clientAuthentication.Handle], controller.TokenGrant)
// router.post('/api/auth/client', controller.ClientRegistration)
router.post('/api/auth/logout', [tokenAuthentication.Handle], controller.Logout)
router.get('/api/auth/public_key', cors(corsOptions), controller.getPublicKey)     //them cors
router.get('/api/auth/test', controller.Test)

module.exports = router;