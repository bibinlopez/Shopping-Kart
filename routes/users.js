var express = require('express');
var router = express.Router();
var userController = require('../controllers/user')
var cartController = require('../controllers/cart')
var authCheck = require('../middleWares/auth')


router.post('/registration',userController.registration )


router.post('/login',userController.login)



router.put('/editUser/:id',authCheck.userAuthCheck,userController.editUser)

router.put('/resetPassword/:id',authCheck.userAuthCheck,userController.resetPassword)

router.delete('/delete/:id',userController.deleteUser)


router.post('/addCart',authCheck.userAuthCheck,cartController.addCart )


module.exports = router;
