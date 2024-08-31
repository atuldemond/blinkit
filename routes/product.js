const express = require("express");
const router = express.Router();
const passport = require("passport");
const { productModel, validateProduct } = require("../models/product");
const { categoryModel, validateCategory } = require("../models/category");
const upload = require("../config/multer_confiig");
const { string } = require("joi");
const validateAdmin = require("../middleware/admin");
router.get("/", async (re, res) => {
  let prods = await productModel.find();
  res.send(prods);
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
