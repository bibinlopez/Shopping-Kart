var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin')
var authCheck = require('../middleWares/auth')
var productController = require('../controllers/product')
var userController = require('../controllers/user')
var path = require('path')
const multer = require('multer');

router.post('/registration',adminController.adminRegistration )

router.post('/login',adminController.adminLogin)



router.put('/edit/:id',authCheck.adminAuthCheck,adminController.editAdmin)
router.put('/edit2/:id',authCheck.adminAuthCheck,adminController.editAdmin2)

router.delete('/delete/:id',adminController.deleteAdmin)


router.get('/listUser',userController.listUser)


var storage = multer.diskStorage({
    destination: './public/productImage' ,
    filename: function (req, file, cb) {
      console.log("this is file: ",file);
    //   console.log("*****",file.originalname);

      var ext = path.extname(file.originalname)
      cb(null, file.fieldname + '-' + Date.now()+ext)
    }
  })
  var upload = multer({ storage: storage })
router.use('/',express.static('./public/productImage'))

router.post('/addProduct',upload.single('image'),productController.addProduct)
router.get('/listProduct',authCheck.adminAuthCheck,productController.listProduct)
router.get('/getProduct/:id',authCheck.adminAuthCheck,productController.getProduct)
router.delete('/deleteProduct/:id',authCheck.adminAuthCheck,productController.deleteProduct)
router.put('/updateProduct/:id',upload.single('image'),authCheck.adminAuthCheck,productController.updateProduct)


module.exports = router;
