const mongoose = require('mongoose');
const AddressSchema = mongoose.Schema({
    state:String,
    zip:Number ,
    city:String,
    address:String
})
const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phone:Number,
    addresses:[AddressSchema]
    

},{timestamps:true});
module.exports= mongoose.model("user", userSchema)