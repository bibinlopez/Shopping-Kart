const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const emailvalidator = require("email-validator");
var passwordValidator = require('password-validator');
var schema = new passwordValidator();

schema
    .is().min(6)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()
    .has().symbols()
    .is().not().oneOf(['Passw0rd', 'Password123']);

const adminController = {
    adminRegistration: (req, res) => {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (!(password === confirmPassword)) {
            return res.status(422).json({
                success: false,
                error: "Password and Confirm password should be the same"
            })
        } else {


            const validate = schema.validate(req.body.password)
            if (validate === false) {
                return res.status(422).json({
                    success: false,
                    error: "password doesn't meet requirement"
                })
            } else {
                if (emailvalidator.validate(req.body.email)) {
                    Admin.findOne({ email: req.body.email })
                        .then((result) => {
                            if (result) {
                                return res.status(422).json({
                                    success: false,
                                    error: "email id already exist"
                                })
                            } else {
                                const saltRounds = 10
                                bcrypt.genSalt(saltRounds, function (saltError, salt) {
                                    if (saltError) {
                                        throw saltError
                                    } else {
                                        bcrypt.hash(req.body.password, salt, function (hashError, hash) {
                                            if (hashError) {
                                                throw hashError
                                            } else {
                                                var data = {
                                                    name: req.body.name,
                                                    email: req.body.email,
                                                    password: hash
                                                }
                                                var admin = new Admin(data)
                                                admin.save()
                                                    .then((result) => {

                                                        // console.log("result", result._id);
                                                        jwt.sign({ result }, process.env.JWT_ADMINSECRETKEY, { expiresIn: '300s' }, (err, token) => {
                                                            if (!err) {
                                                                console.log(token);
                                                                var resp = {
                                                                    name: result.name,
                                                                    email: result.email,
                                                                    password: result.password,
                                                                    token: token,
                                                                    _id: result._id

                                                                }
                                                                return res.status(200).json({
                                                                    success: true,
                                                                    data: resp
                                                                })
                                                            } else {
                                                                console.log("error", err);
                                                                return res.status(422).json({
                                                                    success: false,
                                                                    error: err
                                                                })
                                                            }
                                                        })

                                                        // return res.status(200).json({
                                                        //     success: true,
                                                        //     data : result
                                                        // })
                                                    })
                                                    .catch((err) => {
                                                        console.log("error2", err);
                                                        return res.status(422).json({
                                                            success: false,
                                                            error: err
                                                        })
                                                    })

                                            }
                                        })
                                    }
                                })
                            }
                        })
                } else {
                    return res.status(422).json({
                        success: false,
                        error: "invalid email"
                    })
                }
            }
        }
    },
    login: (req, res) => {
        Admin.findOne({ email: req.body.email })
            .then((result) => {
                console.log('result', result);
                const hash = result.password
                bcrypt.compare(req.body.password, hash, function (error, isMatch) {
                    if (isMatch) {
                        jwt.sign({ result }, process.env.JWT_ADMINSECRETKEY, { expiresIn: '600s' }, (err, token) => {
                            if (!err) {
                                var resp = {
                                    name: result.name,
                                    email: result.email,
                                    password: result.password,
                                    age: result.age,
                                    token: token
                                }
                                return res.status(200).json({
                                    success: true,
                                    data: resp
                                })
                            } else {
                                console.log("error", err);
                                return res.status(422).json({
                                    success: false,
                                    error: err
                                })
                            }
                        })
                    } else {
                        return res.status(422).json({
                            success: false,
                            data: "Password doesn't match!"
                        })
                    }
                })
            })
            .catch(() => {
                return res.status(422).json({
                    success: false,
                    data: "invalid email Id"
                })
            })



    },
    editUser: (req, res) => {
        if (req.body.email) {
            if (!(emailvalidator.validate(req.body.email))) {
                return res.status(422).json({
                    success: false,
                    error: "invalid email"
                })
            }
        }

        Admin.findOne({ email: req.body.email })
            .then((result) => {
                if (result) {
                    return res.status(422).json({
                        success: false,
                        data: "email id already exist"
                    })
                } else {
                    Admin.findById(req.params.id)
                        .then((result) => {
                            const hash = result.password
                            bcrypt.compare(req.body.oldPassword, hash, function (error, isMatch) {

                                if (isMatch) {
                                    const saltRounds = 10
                                    bcrypt.genSalt(saltRounds, function (saltError, salt) {
                                        if (saltError) {
                                            throw saltError
                                        } else {
                                            bcrypt.hash(req.body.password, salt, function (hashError, hash) {
                                                if (hashError) {
                                                    throw hashError
                                                } else {
                                                    console.log('hash',hash);
                                                    var data = {
                                                        name: req.body.name,
                                                        email: req.body.email,
                                                        password: hash
                                                    }
                                                    Admin.findByIdAndUpdate(req.params.id, { $set: data },)
                                                        .then((result) => {
                                                            // console.log(result);
                                                            if (result) {

                                                                return res.status(200).json({
                                                                    success: true,
                                                                    data: "Successfully Updated"
                                                                })
                                                            } else {
                                                                return res.status(422).json({
                                                                    success: false,
                                                                    data: "admin not Found"
                                                                })
                                                            }

                                                        })
                                                        .catch((err) => {
                                                            return res.status(422).json({
                                                                success: false,
                                                                error: err
                                                            })
                                                        })
                                                }
                                            })
                                        }

                                    })
                                }else{
                                    return res.status(422).json({
                                        success: false,
                                        data: "Password doesn't match!"
                                    })
                                }





                            })
                        })



                }
            })
            .catch((err) => {
                console.log('error', err);
                return res.status(422).json({
                    success: false,
                    error: err
                })
            })







    },
    deleteUser: (req, res) => {
        user.findByIdAndRemove(req.params.id)
            .then((result) => {
                console.log(result);
                if (result) {
                    return res.status(200).json({
                        success: true,
                        data: "Successfully Deleted"
                    })
                } else {
                    return res.status(422).json({
                        success: false,
                        data: "user not Found"
                    })
                }

            })
            .catch((err) => {
                return res.status(422).json({
                    success: false,
                    error: err
                })
            })

    }
}


module.exports = adminController