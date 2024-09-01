const express = require("express");
const router = express.Router();
const { categoryModel, validateCategory } = require("../models/category");
const { validateAdmin } = require("../middleware/admin");

router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;

    // Validate that the name field is provided
    if (!name) {
      return res.status(400).send("Category name is required.");
    }

    // Check if the category already exists
    let existingCategory = await categoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(400).send("Category already exists.");
    }

    // Create a new category
    let category = await categoryModel.create({ name });

    res.status(201).send("Category created successfully.");
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).send("An error occurred while creating the category.");
  }
});

module.exports = router;
