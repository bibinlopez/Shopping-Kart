const mongoose= require('mongoose')
const schema = mongoose.Schema;
const userSchema= new schema({
    name:{type:String, require: true},
    age:{type:Number, require: true},
    place:{type:String, require: true},
    password:{type:String, require: true},
    email:{type:String, require: true},

})

userSchema.pre('save', function(){});

module.exports= mongoose.model('User',userSchema);