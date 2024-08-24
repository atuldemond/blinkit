const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Address Schema
const AddressSchema = mongoose.Schema({
  state: { type: String, required: true, minlength: 2 },
  zip: { type: Number, required: true, min: 10000, max: 999999 }, // Example range for zip code
  city: { type: String, required: true, minlength: 2 },
  address: { type: String, required: true, minlength: 5 },
});

// Mongoose User Schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, minlength: 8 },
    phone: { type: Number, minlength: 10, maxlength: 10 },
    addresses: { type: [AddressSchema] },
  },
  { timestamps: true }
);

// Joi Address Schema
const addressJoiSchema = Joi.object({
  state: Joi.string().min(2).required(),
  zip: Joi.number().integer().min(10000).max(99999).required(),
  city: Joi.string().min(2).required(),
  address: Joi.string().min(5).required(),
});

// Joi User Schema
const userJoiSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
  addresses: Joi.array().items(addressJoiSchema).required(),
});

// Function to Validate User Data with Joi
const validateUser = (data) => {
  return userJoiSchema.validate(data);
};

// Mongoose User Model
const UserModel = mongoose.model("user", userSchema);

module.exports = {
  userModel: mongoose.model("user", userSchema),
  validateUser,
};
