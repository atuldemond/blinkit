const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Category Schema
const categorySchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 2, unique: true }
}, { timestamps: true });

// Joi Category Validation Schema
const categoryJoiSchema = Joi.object({
    name: Joi.string().min(2).required()
});

// Function to Validate Category Data with Joi
const validateCategory = (data) => {
    return categoryJoiSchema.validate(data);
};

// Mongoose Category Model
const CategoryModel = mongoose.model("category", categorySchema);

module.exports = {
    categoryModel:mongoose.model("category", categorySchema),
    validateCategory
};
