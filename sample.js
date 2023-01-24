Admin.findOne({ email: req.body.email })
.then((result) => {
    if (result) {
        return res.status(422).json({
            success: false,
            data: "email id already exist"
        })
    } else {
        if (!(emailvalidator.validate(req.body.email))) {
            return res.status(422).json({
                success: false,
                error: "invalid email"
            })
        } else {
            Admin.findByIdAndUpdate(req.params.id, { $set: req.body },)
                .then((result) => {
                    console.log(result);
                    if (result) {
                        return res.status(200).json({
                            success: true,
                            data: "Successfully Updated"
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
})
.catch((err) => {
    console.log('error', err);
    return res.status(422).json({
        success: false,
        error: err
    })
})


// Admin.findOne({ password: req.body.ol })


// var data = {
//     name: req.body.name,
//     email: req.body.email
// }
