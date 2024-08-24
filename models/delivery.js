const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Delivery Schema
const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: true
    },
    deliveryBoy: { type: String, required: true, minlength: 2 },
    status: { type: String, required: true, enum: ['pending', 'in-transit', 'delivered', 'cancelled'] },
    trackingUrl: { type: String, required: true, match: /https?:\/\/[^\s]+/ },
    estimatedDeliveryTime: { type: Number, required: true, min: 0 }
}, { timestamps: true });

// Joi Delivery Validation Schema
const deliveryJoiSchema = Joi.object({
    order: Joi.string().required(),
    deliveryBoy: Joi.string().min(2).required(),
    status: Joi.string().valid('pending', 'in-transit', 'delivered', 'cancelled').required(),
    trackingUrl: Joi.string().uri().required(),
    estimatedDeliveryTime: Joi.number().min(0).required()
});

// Function to Validate Delivery Data with Joi
const validateDelivery = (data) => {
    return deliveryJoiSchema.validate(data);
};

// Mongoose Delivery Model
const DeliveryModel = mongoose.model("delivery", deliverySchema);

module.exports = {
    deliveryModel:mongoose.model("delivery", deliverySchema),
    validateDelivery
};
