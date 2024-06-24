const express = require('express');
const router = express.Router();
const userController =require('./controllers/UserController')
const fingerprintController = require('./controllers/FingerprintController')
const linkedAccountController = require('./controllers/LinkedAccountController')
const otpController = require('./controllers/OtpController')

router.get('/api/iden/users', userController.getAll)
router.get('/api/iden/user/:id', userController.getUser)
// router.post('/api/iden/user', userController.createUser)
// router.put('/api/iden/user/:id/update', userController.updateUser)
// router.delete('/api/iden/user/:id/delete', userController.deleteUser)
router.post('/api/iden/user/authen', userController.authenticateUser)

router.post('/api/iden/user/authen/linked_account', linkedAccountController.authenticateLinkedAccount)

router.post('/api/iden/fingerprint/authen', fingerprintController.authenticateFingerprint)
router.post('/api/iden/fingerprint/save', fingerprintController.saveFingerprint)

router.post('/api/iden/otp/send', otpController.sendOtp)
router.post('/api/iden/otp/authen', otpController.authenticateOtp)

module.exports = router;