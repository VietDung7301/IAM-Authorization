const express = require('express');
const router = express.Router();
const controller = require('./controller');
const cors = require('cors');

router.get('/students', cors({origin: [process.env.ACCESS_MODULE]}), controller.getStudents);

module.exports = router;