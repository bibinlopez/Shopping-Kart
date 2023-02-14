const user = require('../models/user')
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

const userController = {


    registration: (req, res) => {
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
                    user.findOne({ email: req.body.email })
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
                                                    place: req.body.place,
                                                    password: hash,
                                                    age: req.body.age
                                                }
                                                var User = new user(data)
                                                User.save()
                                                    .then((result) => {

                                                        console.log("result", result);
                                                        jwt.sign({ result }, process.env.JWT_SECRETKEY, { expiresIn: '300s' }, (err, token) => {
                                                            if (!err) {
                                                                console.log(token);
                                                                var resp = {
                                                                    name: result.name,
                                                                    email: result.email,
                                                                    place: result.place,
                                                                    password: result.password,
                                                                    age: result.age,
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
                                                    })
                                                    .catch((err) => {
                                                        console.log("error2", err);
                                                        return res.status(422).json({
                                                            success: false,
                                                            error: err.toString()
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
        user.findOne({ email: req.body.email })
            .then((result) => {
                const hash = result.password
                bcrypt.compare(req.body.password, hash, function (error, isMatch) {
                    if (isMatch) {
                        jwt.sign({ result }, process.env.JWT_SECRETKEY, { expiresIn: '3000s' }, (err, token) => {
                            if (!err) {
                                var resp = {
                                    name: result.name,
                                    email: result.email,
                                    place: result.place,
                                    password: result.password,
                                    age: result.age,
                                    token: token,
                                    id: result._id
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
    editUser2: (req, res) => {
        if (req.body.password) {
            const validate = schema.validate(req.body.password)
            if (validate === false) {
                return res.status(422).json({
                    success: false,
                    error: "password doesn't meet requirement"
                })
            }
        }
        else {
            user.findById(req.params.id)
                .then((result) => {
                    const hash = result.password
                    bcrypt.compare(req.body.oldPassword, hash, function (error, isMatch) {

                        if (isMatch) {
                            if (!(emailvalidator.validate(req.body.email))) {
                                return res.status(422).json({
                                    success: false,
                                    error: "invalid email"
                                })
                            } else {
                                user.findOne({ email: req.body.email })
                                    .then((result) => {
                                        if (result) {
                                            return res.status(422).json({
                                                success: false,
                                                data: "email id already exist"
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
                                                            console.log('hash', hash);
                                                            var data = {
                                                                name: req.body.name,
                                                                email: req.body.email,
                                                                password: hash,
                                                                age: req.body.age,
                                                                place: req.body.place
                                                            }
                                                            user.findByIdAndUpdate(req.params.id, { $set: data },)
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

                                        }

                                    })
                                    .catch((err) => {
                                        console.log('error', err);
                                        return res.status(422).json({
                                            success: false,
                                            error: err
                                        })

                                    })

                            }

                        } else {
                            return res.status(422).json({
                                success: false,
                                data: "Password doesn't match!"
                            })
                        }
                    }
                    )
                })
        }

    },
    // editUser: async (req, res) => {

    //     var emailCheck = await user.findOne({ email: req.body.email })

    //         .then((result) => {
    //             console.log('this is result', result);
    //             return result
    //         })
    //         .catch((err) => {
    //             console.log('error', err);
    //             return res.status(422).json({
    //                 success: false,
    //                 error: err
    //             })

    //         })

    //     if (!emailCheck) {
    //         var emailValidate = await emailvalidator.validate(req.body.email)

    //     } else {
    //         return res.status(422).json({
    //             success: false,
    //             data: "email id already exist"
    //         })
    //     }

    //     if (emailValidate === false) {
    //         return res.status(422).json({
    //             success: false,
    //             error: "invalid email"
    //         })

    //     } else {
    //         var validate = await schema.validate(req.body.password)

    //     }

    //     if (validate === false) {
    //         return res.status(422).json({
    //             success: false,
    //             error: "password doesn't meet requirement"
    //         })
    //     } else {
    //         var findPassword = await user.findById(req.params.id)
    //             .then((result) => {
    //                 console.log('old data', result);
    //                 // return result 

    //             })
    //             .catch((err) => {
    //                 console.log('error', err);
    //                 return res.status(422).json({
    //                     success: false,
    //                     error: err
    //                 })

    //             })
    //     }

    //     if (findPassword) {
    //         const hash = findPassword.password
    //         var Match = await bcrypt.compare(req.body.oldPassword, hash, function (error, isMatch) {
    //             return isMatch;
    //         })
    //     }

    //     if (!Match) {
    //         return res.status(422).json({
    //             success: false,
    //             data: "Password doesn't match!"
    //         })
    //     } else {
    //         const saltRounds = 10
    //         bcrypt.genSalt(saltRounds, function (saltError, salt) {
    //             if (saltError) {
    //                 throw saltError
    //             } else {
    //                 bcrypt.hash(req.body.password, salt, function (hashError, hash) {
    //                     if (hashError) {
    //                         throw hashError
    //                     } else {
    //                         console.log('hash', hash);
    //                         var data = {
    //                             name: req.body.name,
    //                             email: req.body.email,
    //                             password: hash,
    //                             age: req.body.age,
    //                             place: req.body.place
    //                         }
    //                         user.findByIdAndUpdate(req.params.id, { $set: data },)
    //                             .then((result) => {
    //                                 // console.log(result);
    //                                 if (result) {

    //                                     return res.status(200).json({
    //                                         success: true,
    //                                         data: "Successfully Updated"
    //                                     })
    //                                 } else {
    //                                     return res.status(422).json({
    //                                         success: false,
    //                                         data: "admin not Found"
    //                                     })
    //                                 }

    //                             })
    //                             .catch((err) => {
    //                                 return res.status(422).json({
    //                                     success: false,
    //                                     error: err
    //                                 })
    //                             })

    //                     }
    //                 })
    //             }
    //         })
    //     }



    // },
    editUser: (req, res) => {
        // var data = req.body
        if (req.body.email) {

            user.findOne({ email: req.body.email })
                .then((result) => {
                    if (result) {
                        console.log(result);
                        return res.status(200).json({
                            success: false,
                            error: "email already exist"
                        })
                    } else {
                        if (!(emailvalidator.validate(req.body.email))) {
                            return res.status(422).json({
                                success: false,
                                error: "invalid email"
                            })
                        } else {


                            var data = {
                                name: req.body.name,
                                email: req.body.email,
                                age: req.body.age,
                                place: req.body.place
                            }

                            user.findByIdAndUpdate(req.params.id, { $set: data })
                                .then((result) => {
                                    if (result) {
                                        return res.status(200).json({
                                            success: true,
                                            message: 'successfully updated'
                                        })
                                    } else {
                                        return res.status(200).json({
                                            success: false,
                                            error: "user not found"
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
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(422).json({
                        success: false,
                        error: err
                    })
                })


        } else {
            var data = {
                name: req.body.name,
                age: req.body.age,
                place: req.body.place
            }

            user.findByIdAndUpdate(req.params.id, { $set: data })
                .then((result) => {
                    if (result) {
                        return res.status(200).json({
                            success: true,
                            message: 'successfully updated'
                        })
                    } else {
                        return res.status(200).json({
                            success: false,
                            error: "user not found"
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
    },
    resetPassword: (req, res) => {
        
            const validate = schema.validate(req.body.newPassword)
            if (validate === false) {
                return res.status(501).json({
                    success: false,
                    error: "password doesn't meet requirement"
                })
            } else {
                const newPassword = req.body.newPassword;
                const confirmNewPassword = req.body.confirmNewPassword;
                if (!(newPassword === confirmNewPassword)) {
                    return res.status(502).json({
                        success: false,
                        error: "Password and Confirm password should be the same"
                    })
                } else {
                    user.findById(req.params.id)
                        .then((result) => {
                            const hash = result.password
                            bcrypt.compare(req.body.currentPassword, hash, function (error, isMatch) {

                                if (!isMatch) {
                                    return res.status(503).json({
                                        success: false,
                                        error: "Please enter valid correct current password!"
                                    })
                                } else {
                                    const saltRounds = 10
                                    bcrypt.genSalt(saltRounds, function (saltError, salt) {
                                        if (saltError) {
                                            throw saltError
                                        } else {
                                            bcrypt.hash(req.body.newassword, salt, function (hashError, hash) {
                                                if (hashError) {
                                                    return res.status(422).json({
                                                        success: false,
                                                        error: hashError
                                                    })
                                                } else {
                                                    console.log('**********',req.params.id);
                                                    console.log('hash', hash);
                                                    var data = {
                                                        password: hash
                                                    }
                                                    user.findByIdAndUpdate(req.params.id, { $set: data },)
                                                        .then((result) => {
                                                            // console.log(result);
                                                            if (result) {

                                                                return res.status(200).json({
                                                                    success: true,
                                                                    data: "Successfully Updated"
                                                                })
                                                            } else {
                                                                return res.status(504).json({
                                                                    success: false,
                                                                    data: "admin not Found"
                                                                })
                                                            }

                                                        })
                                                        .catch((err) => {
                                                            return res.status(500).json({
                                                                success: false,
                                                                error: 'error'
                                                            })
                                                        })

                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        })
                        .catch((err) => {
                            return res.status(404).json({
                                success: false,
                                error: err
                            })
                        })




                }
            }
        




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

    },
    listUser: (req, res) => {
        user.find()
            .then((result) => {
                return res.status(200).json({
                    success: true,
                    data: result
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

module.exports = userController