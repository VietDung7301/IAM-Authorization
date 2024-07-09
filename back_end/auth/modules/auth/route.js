const express = require('express');
const router = express.Router();
const cors = require('cors');
const grantCodeController = require('./controllers/GrantCodeController')
const grantTokenController = require('./controllers/GrantTokenController')
const otpController = require('./controllers/OtpController')
const logoutController = require('./controllers/LogoutController')
const codeReqValidation = require('./middlewares/CodeReqValidation')
const userValidation = require('./middlewares/UserValidation')
const linkedAccountValidation = require('./middlewares/LinkedAccountValidation')
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
        ], grantCodeController.authCodeGrant)
router.post('/api/auth/token', [
            cors({
                origin: '*',
                credentials: true,
                allowedHeaders: 'Authorization',
                methods: 'POST'
            }),
            markedUserValidation.Handle, 
            clientAuthentication.Handle
        ], grantTokenController.tokenGrant)
// router.post('/api/auth/client', controller.ClientRegistration)

router.post('/api/auth/logout', [cors(), tokenAuthentication.Handle], logoutController.logout)

router.post('/api/auth/logout_all', [cors({origin: process.env.FE_URL,}), tokenAuthentication.Handle], logoutController.logoutAll)

router.post('/api/auth/login/linked_account', [
            cors({origin: process.env.FE_URL,}),
            codeReqValidation.Handle, 
            clientValidation.Handle, 
            linkedAccountValidation.Handle, 
            fingerprintCheck.Handle
        ], grantCodeController.authCodeGrant)

//set cors only for frontend
router.post('/api/auth/otp/send', cors({origin: process.env.FE_URL,}), otpController.sendOtp)
router.post('/api/auth/otp/authenticate', cors({origin: process.env.FE_URL,}), otpController.authenticateOtp)

//get client by redirect_uri
router.get('/api/auth/client/get_by_redirect_uri', cors({origin: process.env.FE_URL,}), grantCodeController.getClientByRedirectUri)

module.exports = router;
