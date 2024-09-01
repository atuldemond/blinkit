const express = require("express");
const router = express.Router();
const { cartModel, validateCart } = require("../models/cartModel");
const { validateAdmin, userIsLoggedIn } = require("../middleware/admin");
const { productModel } = require("../models/product");

router.get("/", userIsLoggedIn, async (req, res) => {
  let cart = await cartModel.findOne({ user: req.session.passport.user });
  res.send(cart);
});
router.get("/add/:id", userIsLoggedIn, async (req, res) => {
  try {
    // Fetch the cart for the logged-in user
    let cart = await cartModel.findOne({ user: req.session.passport.user });

    // Fetch the product by its ID
    let product = await productModel.findOne({ _id: req.params.id });

    if (!cart) {
      // If no cart exists for the user, create a new cart
      cart = await cartModel.create({
        user: req.session.passport.user,
        products: [req.params.id], // Corrected here
        totalPrice: Number(product.price),
      });
    } else {
      // If a cart exists, add the product to it
      cart.products.push(req.params.id); // Corrected here
      cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
      await cart.save();
    }

    // Send the cart as the response
    res.redirect("back");
  } catch (error) {
    // Send any error messages as the response
    res.send(error.message);
  }
});

router.get("/remove/:id", userIsLoggedIn, async (req, res) => {
  try {
    // Fetch the cart for the logged-in user
    let cart = await cartModel.findOne({ user: req.session.passport.user });

    if (!cart) return res.send("Something went wrong");

    // Find the product in the cart
    let index = cart.products.indexOf(req.params.id);
    if (index !== -1) {
      // Fetch the product to get its price
      let product = await productModel.findOne({ _id: req.params.id });

      // Remove the product from the cart
      cart.products.splice(index, 1);

      // Update the total price
      cart.totalPrice = Number(cart.totalPrice) - Number(product.price);

      // Save the updated cart
      await cart.save();

      // Send the updated cart as the response
      res.redirect("back");
    } else {
      return res.send("Item is not in the cart");
    }
  } catch (error) {
    // Send any error messages as the response
    res.send(error.message);
  }
});

module.exports = router;
