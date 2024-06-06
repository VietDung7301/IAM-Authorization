const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/api/iden/users', controller.getAll)
router.get('/api/iden/user/:id', controller.getUser)
router.post('/api/iden/user', controller.createUser)
router.post('/api/iden/user/authen', controller.authenticateUser)
router.post('/api/iden/user/authen/linked_account', controller.authenticateLinkedAccount)
router.put('/api/iden/user/:id/update', controller.updateUser)
router.delete('/api/iden/user/:id/delete', controller.deleteUser)
router.post('/api/iden/fingerprint/authen', controller.authenticateFingerprint)
router.post('/api/iden/otp/send', controller.sendOtp)
router.post('/api/iden/otp/authen', controller.authenticateOtp)
router.post('/api/iden/fingerprint/save', controller.saveFingerprint)
module.exports = router;