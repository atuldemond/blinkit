const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Order Schema
const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
    address: { type: String, minlength: 5 },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
      required: true,
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "delivery",
    },
  },
  { timestamps: true }
);

// Joi Order Validation Schema
const orderJoiSchema = Joi.object({
  user: Joi.string().required(),
  products: Joi.array().items(Joi.string().required()).required(),
  totalPrice: Joi.number().min(0).required(),
  address: Joi.string().min(5).required(),
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
  payment: Joi.string().required(),
  delivery: Joi.string().optional(),
});

// Function to Validate Order Data with Joi
const validateOrder = (data) => {
  return orderJoiSchema.validate(data);
};

// Mongoose Order Model
const OrderModel = mongoose.model("order", orderSchema);

module.exports = {
  orderModel: mongoose.model("order", orderSchema),
  validateOrder,
};
