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


router.post('/addCart',cartController.addCart )

router.put('/deleteCartProduct',cartController.deleteCartProduct )

router.put('/quantityCartProduct',cartController.quantityCartProduct )

router.put('/removeProducts',cartController.removeProducts )

router.get('/listProducts',cartController.listProducts )

module.exports = router;
