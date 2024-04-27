const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/api/iden/users', controller.getAll)
router.get('/api/iden/user/:id', controller.getUser)
router.post('/api/iden/user', controller.createUser)
router.post('/api/iden/user/authen', controller.authenticateUser)
router.put('/api/iden/user/:id/update', controller.updateUser)
router.delete('/api/iden/user/:id/delete', controller.deleteUser)
router.get('/api/iden/user/:id/fingerprints', controller.getFingerprint)
router.get('/api/iden/test', controller.test)

module.exports = router;