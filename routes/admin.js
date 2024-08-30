const express = require("express");
const router = express.Router();
const { adminModel } = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/create", async (req, res) => {
  try {
    let admin = await new adminModel({
      name: "Atul Demond",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("admin", 10),
      role: "admin",
    });

    await admin.save();

    let token = jwt.sign({ email: "admin@gmail.com" }, process.env.JWT_KEY);

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

router.get("/dashboard", (req, res) => {
  res.render("admin_dashboard");
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
        let token = jwt.sign({ email: admin.email }, process.env.JWT_KEY);
        res.cookie("token", token);
        res.redirect("/admin/dashboard");
      } else {
        res.send("wrong password");
      }
    });
  }
});

module.exports = router;
