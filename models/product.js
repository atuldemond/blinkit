// productModel.js

const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: true,
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    image: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

// Joi Product Validation Schema
const productValidationSchema = Joi.object({
  name: Joi.string().min(2).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().min(2).required(),
  stock: Joi.number().required(),
  description: Joi.string().max(500).optional().allow(""),
  image: Joi.string().uri().optional().allow(""),
});

// Function to validate product data using Joi
const validateProduct = (productData) => {
  return productValidationSchema.validate(productData);
};

// Mongoose Product Model
const ProductModel = mongoose.model("Product", productSchema);

module.exports = {
  productModel: mongoose.model("Product", productSchema),
  validateProduct,
};
