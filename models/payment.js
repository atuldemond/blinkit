const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Payment Schema
const paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: true
    },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, required: true, minlength: 2 },
    status: { type: String, required: true, enum: ['pending', 'completed', 'failed'] },
    transactionID: { type: String, required: true, unique: true }
}, { timestamps: true });

// Joi Payment Validation Schema
const paymentJoiSchema = Joi.object({
    order: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    method: Joi.string().min(2).required(),
    status: Joi.string().valid('pending', 'completed', 'failed').required(),
    transactionID: Joi.string().required()
});

// Function to Validate Payment Data with Joi
const validatePayment = (data) => {
    return paymentJoiSchema.validate(data);
};

// Mongoose Payment Model
const PaymentModel = mongoose.model("payment", paymentSchema);

module.exports = {
    paymentModel:mongoose.model("payment", paymentSchema),
    validatePayment
};
