
const jwt = require('jsonwebtoken')


const authCheck = {
    userAuthCheck: (req, res, next) => {
        // console.log("@@@@",req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1]
        console.log("***********",token);

        jwt.verify(token, process.env.JWT_SECRETKEY, (err,decode)=>{
            console.log('error',err);
            console.log('response' , decode);
            if(err){
                console.log('@@@@@@@');
                return res.status(500).json({
                    success: false,
                    error : err
                })
            }

        })
        next()
    },
    adminAuthCheck: (req, res, next) => {
        // console.log("@@@@",req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1]
        console.log("***********",token);

        jwt.verify(token, process.env.JWT_ADMINSECRETKEY, (err,decode)=>{
            console.log('error',err);
            console.log('response' , decode);
            if(err){
                console.log('@@@@@@@');
                return res.status(500).json({
                    success: false,
                    error : err
                })
            }

        })

        next()
    }
}

module.exports = authCheck;