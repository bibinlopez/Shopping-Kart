const Product = require('../models/product')

const productController = {
    addProduct: (req, res) => {
        var data = req.body
        // console.log('data',data);
        Product.findOne({ name: req.body.name })
            .then((result) => {
                if (result) {
                    console.log(result);
                    return res.status(200).json({
                        success: false,
                        error: "Product already exist"
                    })
                } else {
                    // console.log('data2',data);
                    var photo = `/${req.file.filename}`
                    // console.log('this is file',req.file);
                    var data = {
                        name: req.body.name,
                        price: req.body.price,
                        weight: req.body.weight,
                        color: req.body.color,
                        image: photo
                    }
                    var product = new Product(data)
                    product.save()
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
                }
            })
            .catch((err) => {
                return res.status(200).json({
                    success: false,
                    error: err
                })
            })

    },
    listProduct: (req, res) => {
        Product.find()
            .then((result) => {
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

    },
    getProduct: (req, res) => {
        Product.findById(req.params.id)
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

    },
    updateProduct: (req, res) => {
        var data = req.body
        Product.findOne({ name: req.body.name })
            .then((result) => {
                if (result) {
                    console.log(result);
                    return res.status(200).json({
                        success: false,
                        error: "Product already exist"
                    })
                } else {
                    // var photo=`/${req.file.filename}`
                    // console.log('this is file',req.file);
                    if (req.file) {
                        var photo = `/${req.file.filename}`
                    }
                    var data = {
                        name: req.body.name,
                        price: req.body.price,
                        weight: req.body.weight,
                        color: req.body.color,
                        image: photo
                    }
                    Product.findByIdAndUpdate(req.params.id, { $set: data })
                        .then((result) => {
                            if (result) {
                                return res.status(200).json({
                                    success: true,
                                    message: 'successfully updated'
                                })
                            } else {
                                return res.status(200).json({
                                    success: false,
                                    error: "Product not found"
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
            })
            .catch((err) => {
                console.log(err)
                return res.status(422).json({
                    success: false,
                    error: err
                })
            })

    },
    deleteProduct: (req, res) => {
        Product.findByIdAndRemove(req.params.id)
            .then((result) => {
                if (result) {
                    return res.status(200).json({
                        success: true,
                        data: "Deleted Brand successfully"
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

    },
}

module.exports = productController