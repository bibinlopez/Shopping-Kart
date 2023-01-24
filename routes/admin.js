var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin')
var authCheck = require('../middleWares/auth')



router.post('/registration',adminController.adminRegistration )

router.post('/login',adminController.login)



router.put('/edit/:id',authCheck.adminAuthCheck,adminController.editUser)


router.delete('/delete/:id',adminController.deleteUser)

module.exports = router;
