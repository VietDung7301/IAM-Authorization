const express = require('express');
const router = express.Router();
const controller = require('./controller');
// const cors = require('cors')

// cors options
// const corsOptions = {
//     origin: [process.env.AUTH_URL],
// }

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.AUTH_URL);
    // res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

router.get('/api/iden/user/:id', controller.getUser)
router.post('/api/iden/user/authen', controller.authenticateUser)
router.get('/api/iden/test', controller.test)

module.exports = router;