const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
name:String,
email:String,
password:String,
role:String,


});
module.exports= mongoose.model("admin", adminSchema)