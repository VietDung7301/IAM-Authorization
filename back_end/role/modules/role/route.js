const express = require('express');
const router = express.Router();
const scopeController = require('./controllers/ScopeController')
const permissionController = require('./controllers/PermissionController')
const roleController = require('./controllers/RoleController')

// router.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", process.env.AUTH_URL);
//   // res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

router.post('/api/permission/check', permissionController.checkPermission)
router.get('/api/get-scopes-from-role/:roleId', scopeController.getScopesFromRoleId)

module.exports = router;