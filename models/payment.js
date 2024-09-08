const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

// Joi Payment Validation Schema

// Function to Validate Payment Data with Joi

// Mongoose Payment Model
const PaymentModel = mongoose.model("payment", paymentSchema);

module.exports = {
  paymentModel: mongoose.model("payment", paymentSchema),
};
