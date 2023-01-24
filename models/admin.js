const mongoose= require('mongoose')
const schema = mongoose.Schema;
const adminSchema= new schema({
    name:{type:String, require: true},
    oldPassword:{type:String, require: true},
    password:{type:String, require: true},
    email:{type:String, require: true},

})

adminSchema.pre('save', function(){});

module.exports= mongoose.model('Admin',adminSchema);