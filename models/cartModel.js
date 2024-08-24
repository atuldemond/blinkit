const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
 },
 products:[
     {
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
     }
 ]
    ,
 totalPrice:Number,

});
module.exports= mongoose.model("cart", cartSchema)