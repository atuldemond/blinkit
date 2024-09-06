const express = require("express");
const router = express.Router();
const passport = require("passport");
const { productModel, validateProduct } = require("../models/product");
const { categoryModel, validateCategory } = require("../models/category");
const upload = require("../config/multer_confiig");
const { string } = require("joi");
const { validateAdmin, userIsLoggedIn } = require("../middleware/admin");
const { cartModel, validateCart } = require("../models/cartModel");
router.get("/", userIsLoggedIn, async (req, res) => {
  try {
    let somethingInCart = false;
    const results = await productModel.aggregate([
      {
        $group: {
          _id: "$category",
          products: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          products: { $slice: ["$products", 10] },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: [[{ k: "$category", v: "$products" }]] },
        },
      },
      {
        $group: {
          _id: null,
          categories: { $mergeObjects: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          categories: 1,
        },
      },
    ]);

    let cart = await cartModel.findOne({ user: req.session.passport.user });

    // Ensure results is not empty before accessing categories
    const resultObject = results.length > 0 ? results[0].categories : {};

    // Handle the case where the cart is null or products array is empty
    if (cart && cart.products.length > 0) {
      somethingInCart = true;
    }

    let rnproducts = await productModel.aggregate([{ $sample: { size: 7 } }]);

    res.render("index", {
      products: resultObject,
      rnproducts,
      somethingInCart,
      cartCount: cart ? cart.products.length : 0, // Ensure cart exists before accessing products.length
    });
  } catch (error) {
    console.error("Error in aggregation query:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/delete/:id", validateAdmin, async (req, res) => {
  if (req.user.admin) {
    let prods = await productModel.findOneAndDelete({ _id: req.params.id });
    res.redirect("/admin/products");
  } else {
    res.send("you are not an admin");
  }
});

router.post("/delete", validateAdmin, async (req, res) => {
  if (req.user.admin) {
    let prods = await productModel.findOneAndDelete({
      _id: req.body.product_id,
    });
    res.redirect("/admin/products");
  } else {
    res.send("you are not an admin");
  }
});
router.post("/", upload.single("image"), async (req, res) => {
  let { name, price, category, stock, description, image } = req.body;

  let ans = validateProduct({
    name,
    price,
    category,
    stock,
    description,
    image,
  });
  if (ans.error) {
    return res.status(400).send(ans.error.details[0].message);
  }
  let existingCategory = await categoryModel.findOne({ name: category });

  // If the category doesn't exist, create it
  if (!existingCategory) {
    existingCategory = await categoryModel.create({ name: category });
  }

  let product = await productModel.create({
    name,
    price,
    category: existingCategory.name,
    stock,
    description,
    image: req.file.buffer,
  });

  res.redirect(`/admin/dashboard`);
});

module.exports = router;
