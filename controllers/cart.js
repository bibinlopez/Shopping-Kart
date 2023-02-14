const Cart = require('../models/cart')

const cartController = {
    addCart: async (req, res) => {
       
        var userCart = await Cart.findOne({ userId: req.body.userId })
        
        console.log('usercart',userCart);
        if (userCart == null) {
            // no cart add new cart
            
            var data = {
                userId: req.body.userId,
                product: [
                    {
                        productId: req.body.product[0].productId,
                        quantity: 1
                    }
                ]
            }
            
            var cart = new Cart(data)
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
            
            var index = 0
            for (i in userCart.product) {

                console.log(userCart.product[i].productId);
                if (req.body.product[0].productId === userCart.product[i].productId) {
                    index = i
                    var exist = true;
                }
            }

            if (exist === true) {
               
                console.log('product exist,add quantity');
                var oldquantity = userCart.product[index].quantity
                
                var addedQuantity = oldquantity + 1
                console.log('addedQuantity', addedQuantity);
                Cart.findOneAndUpdate(
                    { userId: req.body.userId, 'product.productId': userCart.product[index].productId }
                    , {
                        $set: {
                            'product.$.quantity': addedQuantity
                        }
                    })

                    .then((result) => {
                        console.log('result', result);
                        return res.status(200).json({
                            success: true,
                            message: 'added successfully'
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
                
                var data = {
                    productId: req.body.product[0].productId,
                    quantity: 1
                }
                Cart.findOneAndUpdate({ userId: req.body.userId }, { $push: { product: data } })
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

    },
    deleteCartProduct: async (req, res) => {
        var userCart = await Cart.findOne({ userId: req.body.userId })
        if (userCart) {
            var index = 0
            for (i in userCart.product) {

                if (req.body.productId === userCart.product[i].productId) {
                    index = i
                    var exist = true;
                }
            }

            if (exist === true) {
                
                Cart.findOneAndUpdate({ userId: req.body.userId },
                    {
                        $pull: { product: { productId: req.body.productId } }
                    }
                )
                    .then((result) => {
                        console.log('result', result);
                        return res.status(201).json({
                            success: true,
                            message: 'successfully removed the product'
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(422).json({
                            success: false,
                            error: err
                        })
                    })
            }
        }

    },
    quantityCartProduct: async (req, res) => {
        var userCart = await Cart.findOne({ userId: req.body.userId })
        if (userCart) {
            var index = 0
            for (i in userCart.product) {

                if (req.body.productId === userCart.product[i].productId) {
                    index = i
                    var exist = true;
                }
            }

            if (exist === true) {

                Cart.findOneAndUpdate(
                    { userId: req.body.userId, 'product.productId': userCart.product[index].productId }
                    , {
                        $set: {
                            'product.$.quantity': req.body.quantity
                        }
                    })
                    .then((result) => {
                        console.log('result', result);
                        return res.status(201).json({
                            success: true,
                            message: 'successfully changed the quantity'
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(422).json({
                            success: false,
                            error: err
                        })
                    })
            }
        }

    },
    removeProducts: (req, res) => {

        Cart.findOneAndUpdate({ userId: req.body.userId },
            {
                $unset: { product: "" }
            })
            .then((result) => {
                if (result) {
                    return res.status(201).json({
                        success: true,
                        data: " Cart item removed"
                    })
                } else {
                    return res.status(422).json({
                        success: false,
                        error: "Cart not found"
                    })
                }
            })
            .catch((err) => {
                return res.status(200).json({
                    success: false,
                    error: err
                })
            })
    },
    listProducts: (req, res) => {
        Cart.findOne({ userId: req.body.userId }, { _id: 0 })
            .populate("product.productId")
            .then((result) => {
                if (result) {
                    return res.status(200).json({
                        success: true,
                        data: result
                    })
                } else {
                    return res.status(200).json({
                        success: false,
                        error: "Brand not found"
                    })
                }
            })
            .catch((err) => {
                return res.status(200).json({
                    success: false,
                    error: err
                })
            })

    }
}

module.exports = cartController