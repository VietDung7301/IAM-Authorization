const express = require('express');
const router = express.Router();
const controller = require('./controller');

// router.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", process.env.AUTH_URL);
//   // res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

router.post('/api/access_resource', controller.accessResource)     
router.get('/api/access/test', controller.test)

module.exports = router;