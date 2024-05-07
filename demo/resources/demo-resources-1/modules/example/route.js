const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/students', controller.getStudents);

module.exports = router;