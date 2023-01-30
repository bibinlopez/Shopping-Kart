const Cart = require('../models/cart')

const cartController = {
    addCart: async (req, res) => {
        var quantity = 1;
        var userCart = await Cart.findOne({ userId: req.body.userId })
        // console.log('usercart', userCart)


        if (userCart == null) {
            // no cart add new cart
            // console.log('req.body', req.body);
            var cart = new Cart(req.body)
            cart.save()
                .then((result) => {
                    console.log('result', result);
                    return res.status(200).json({
                        success: true,
                        data: result
                    })
                })
                .catch((err) => {
                    return res.status(200).json({
                        success: false,
                        error: err
                    })
                })
        } else {
            //cart exists
            console.log('usercart', userCart)
            console.log(exist);
            // console.log('productId', req.body.product[0].productId);
            // if(userCart.product.productId)
            var index = 0
            for (i in userCart.product) {
                
                console.log(userCart.product[i].productId);
                if (req.body.product[0].productId === userCart.product[i].productId) {
                    index = i
                    var exist = true;
                }
            }

            if (exist === true) {
                //product exists in the cart update quantity
                console.log('product exist,add quantity');
                var oldquantity = userCart.product[index].quantity
                // console.log('@@@@quantity',userCart.product[i].quantity);
                var newQuantity = req.body.product[0].quantity
                var addedQuantity = oldquantity + newQuantity
                console.log('addedQuantity',addedQuantity);

                // console.log('quantity', userCart.product[i].quantity);
                // console.log('product', userCart.product[i]);
                // let productItem = userCart.product[i];
                // productItem.quantity = addedQuantity;
                // userCart.product[i] = productItem;
                // console.log('product itme',userCart.product[i]);
                // console.log('product id',userCart.product[i]._id);
                Cart.findOneAndUpdate(
                    {userId: req.body.userId, 'product.productId' : userCart.product[index].productId  }
                     , { $set:{ 
                        'product.$.quantity': addedQuantity 
                    }
                })

                .then((result) => {
                    console.log('result', result);
                    return res.status(200).json({
                        success: true,
                        message: result
                    })
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(422).json({
                        success: false,
                        error: err
                    })
                })

            } else {
                //no product in the cart , add product
                console.log('add')
                Cart.findOneAndUpdate({ userId: req.body.userId }, { $push: { product: req.body.product[0] } })
                    .then((result) => {
                        console.log('result', result);
                        return res.status(200).json({
                            success: true,
                            message: 'successfully added'
                        })
                    })
                    .catch((err) => {
                        return res.status(422).json({
                            success: false,
                            error: err
                        })
                    })
            }








        }



        // Cart.findOne({ productId: req.body.productId })
        //     .then((result) => {
        //         if (result) {
        //             quantity = result.quantity + req.body.quantity
        //             console.log('total quantity', quantity);
        //             var data = {
        //                 quantity: quantity,
        //                 productId: req.body.productId,
        //                 userId: req.body.userId
        //             }
        //             Cart.Update({ productId: req.body.productId }, { $set: data })
        //         }else{
        //         var data = {
        //             quantity: req.body.quantity,
        //             productId: req.body.productId,
        //             userId: req.body.userId
        //         }
        //         const cart = new Cart(data);
        //         cart.save()
        //             .then((result) => {
        //                 return res.status(200).json({
        //                     success: true,
        //                     data: result
        //                 })
        //             })
        //             .catch((err) => {
        //                 return res.status(422).json({
        //                     success: false,
        //                     error: err
        //                 })
        //             })
        //         }

        //     })
        //     .catch((err) => {
        //         return res.status(422).json({
        //             success: false,
        //             error: err
        //         })
        //     })
    }
}

module.exports = cartController