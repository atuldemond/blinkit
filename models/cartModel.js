const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Cart Schema
const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    }],
    totalPrice: { type: Number, required: true, min: 0 }
}, { timestamps: true });

// Joi Cart Validation Schema
const cartJoiSchema = Joi.object({
    user: Joi.string().required(),
    products: Joi.array().items(Joi.string().required()).required(),
    totalPrice: Joi.number().min(0).required()
});

// Function to Validate Cart Data with Joi
const validateCart = (data) => {
    return cartJoiSchema.validate(data);
};

// Mongoose Cart Model
const CartModel = mongoose.model("cart", cartSchema);

module.exports = {
    cartModel:mongoose.model("cart", cartSchema),
    validateCart
};
