const mongoose= require('mongoose')
const schema = mongoose.Schema;
const cartSchema= new schema({
    userId:{type:String, require: true}, 
    product:[
        {
            productId:{type: schema.Types.ObjectId ,ref:'Product', require: true},
            quantity:{type:Number, require: true}
        }
    ],
    
})

cartSchema.pre('save', function(){});

module.exports= mongoose.model('Cart',cartSchema);