const mongoose= require('mongoose')
const schema = mongoose.Schema;
const productSchema= new schema({
    name:{type:String, require: true},
    price:{type:Number, require: true},
    weight:{type:String, require: true},
    color:{type:String, require: true},
    image:{type:String, require: true}

})

productSchema.pre('save', function(){});

module.exports= mongoose.model('Product',productSchema);