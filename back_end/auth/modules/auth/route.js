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
            cors(),
            codeReqValidation.Handle, 
            clientValidation.Handle, 
            userValidation.Handle, 
            fingerprintCheck.Handle
        ], controller.authCodeGrant)
router.post('/api/auth/token', [
            cors(),
            markedUserValidation.Handle, 
            clientAuthentication.Handle
        ], controller.tokenGrant)
// router.post('/api/auth/client', controller.ClientRegistration)

router.post('/api/auth/logout', [cors(), tokenAuthentication.Handle], controller.logout)

//set cors only for frontend
router.post('/api/auth/otp/send', cors({origin: [process.env.FE_URL],}), controller.sendOtp)
router.post('/api/auth/otp/authenticate', cors({origin: [process.env.FE_URL],}), controller.authenticateOtp)

module.exports = router;