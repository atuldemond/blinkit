const express = require("express");
const router = express.Router();
const { adminModel } = require("../models/admin");
const { productModel } = require("../models/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateAdmin = require("../middleware/admin");
const { categoryModel } = require("../models/category");

router.get("/create", async (req, res) => {
  try {
    let admin = await new adminModel({
      name: "Atul Demond",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("admin", 10),
      role: "admin",
    });

    await admin.save();

    let token = jwt.sign(
      { email: "admin@gmail.com", admin: true },
      process.env.JWT_KEY
    );

    res.cookie("token", token);
    res.send(admin, "admin created successfully");
  } catch (error) {
    console.error("Error occurred while creating admin:", error.message);
    res.status(500).send("An error occurred while creating the admin");
  }
});
router.get("/login", (req, res) => {
  res.render("admin_login");
});
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let admin = await adminModel.findOne({ email });
  if (!admin) {
    res.send("this is admin is not available");
  } else {
    bcrypt.compare(password, admin.password, (err, result) => {
      if (err) throw err;
      if (result) {
        let token = jwt.sign(
          { email: admin.email, admin: true },
          process.env.JWT_KEY
        );
        res.cookie("token", token);
        res.redirect("/admin/dashboard");
      } else {
        res.send("wrong password");
      }
    });
  }
});

router.get("/dashboard", validateAdmin, async (req, res) => {
  let prodcount = await productModel.countDocuments();
  let categcount = await categoryModel.countDocuments();

  res.render("admin_dashboard", { prodcount, categcount });
});

router.get("/products", validateAdmin, async (req, res) => {
  try {
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
    // for (let key in categoryProducts) {
    //   console.log(categoryProducts[key]);
    // }

    // let products = await productModel.find();
    // Handle case where no results are found
    const categoryProducts = results.length > 0 ? results[0].categories : {};

    res.render("admin_products", { products: categoryProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("An error occurred while fetching products.");
  }
});

router.get("/logout", validateAdmin, (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

module.exports = router;
