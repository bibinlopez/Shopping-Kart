var express = require('express');
var router = express.Router();
var userController = require('../controllers/user')
var authCheck = require('../middleWares/auth')


router.post('/registration',userController.registration )


router.post('/login',userController.login)



router.put('/edit/:id',authCheck.userAuthCheck,userController.editUser)


router.delete('/delete/:id',userController.deleteUser)


module.exports = router;
