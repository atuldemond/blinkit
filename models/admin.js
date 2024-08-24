const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Admin Schema
const adminSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, required: true, enum: ['admin', 'superadmin'], default: 'admin' }
}, { timestamps: true });

// Joi Admin Validation Schema
const adminJoiSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'superadmin').required()
});

// Function to Validate Admin Data with Joi
const validateAdmin = (data) => {
    return adminJoiSchema.validate(data);
};

// Mongoose Admin Model
const AdminModel = mongoose.model("admin", adminSchema);

module.exports = {
    adminModel:mongoose.model("admin", adminSchema),
    validateAdmin
};
