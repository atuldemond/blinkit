const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema({
 order:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"order"
 },
deliveryBoy:String,
status:string,
trackingUrl:string,
estimatedDeliveryTime:Number,

});
module.exports= mongoose.model("delivery", deliverySchema)