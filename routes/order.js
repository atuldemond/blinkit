const express = require("express");
const { paymentModel } = require("../models/payment");
const { orderModel } = require("../models/order");
const { cartModel } = require("../models/cartModel");
const router = express.Router();

router.get("/:userid/:orderid/:paymentid/:signature", async (req, res) => {
  let paymentDetails = await paymentModel.findOne({
    orderId: req.params.orderid,
  });

  console.log(req.params.orderid);
  console.log(paymentDetails);

  if (paymentDetails) {
    let cart = await cartModel.findOne({ user: req.params.userid });
    await orderModel.create({
      orderId: req.params.orderid,
      user: req.params.userid,
      products: cart.products,
      totalPrice: cart.totalPrice,

      status: "processing",
      payment: paymentDetails._id,
    });
    res.redirect(`/map/${req.params.orderid}`);
  } else {
    res.send("Payment Failed");
  }
});

router.post("/address/:orderid", async (req, res) => {
  let order = await orderModel.findOne({ orderId: req.params.orderid });
  if (!order) return res.send("soory this order is doesnot exist");
  if (!req.body.address) return res.send("you must provide an address");
  order.address = req.body.address;
  order.save();
  res.redirect("/");
});

module.exports = router;
