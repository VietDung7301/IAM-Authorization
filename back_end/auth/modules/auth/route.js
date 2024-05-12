const express = require('express');
const router = express.Router();
const controller = require('./controller');
const cors = require('cors');
const codeReqValidation = require('./middlewares/CodeReqValidation')
const userValidation = require('./middlewares/UserValidation')
const clientValidation = require('./middlewares/ClientValidation')
const clientAuthentication = require('./middlewares/ClientAuthentication')
const tokenAuthentication = require('./middlewares/TokenAuthentication')
const fingerprintCheck = require('./middlewares/FingerprintCheck')
const markedUserValidation = require('./middlewares/MarkedUserValidation')

router.post('/api/auth/code', [
            codeReqValidation.Handle, 
            clientValidation.Handle, 
            userValidation.Handle, 
            fingerprintCheck.Handle
        ], controller.authCodeGrant)
router.post('/api/auth/token', [markedUserValidation.Handle, clientAuthentication.Handle], controller.tokenGrant)
// router.post('/api/auth/client', controller.ClientRegistration)

router.post('/api/auth/logout', [tokenAuthentication.Handle], controller.logout)

router.get('/api/auth/public_key', cors({origin: [process.env.ACCESS_URL],}), controller.getPublicKey)

//set cors only for frontend
router.post('/api/auth/otp/send', controller.sendOtp)
router.post('/api/auth/otp/authenticate', controller.authenticateOtp)

module.exports = router;