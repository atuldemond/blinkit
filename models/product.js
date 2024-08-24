// productModel.js

const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    stock: {
        type: Boolean,
        required: true,
        default: true
    },
    description: {
        type: String,
        maxlength: 500,
        trim: true
    },
    image: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL`
        }
    }
}, { timestamps: true });

// Joi Product Validation Schema
const productValidationSchema = Joi.object({
    name: Joi.string().min(2).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().min(2).required(),
    stock: Joi.boolean().required(),
    description: Joi.string().max(500).optional().allow(''),
    image: Joi.string().uri().optional().allow('')
});

// Function to validate product data using Joi
const validateProduct = (productData) => {
    return productValidationSchema.validate(productData);
};

// Mongoose Product Model
const ProductModel = mongoose.model('Product', productSchema);

module.exports = {
    productModel:mongoose.model('Product', productSchema),
    validateProduct
};
