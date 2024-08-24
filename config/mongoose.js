const mongoose = require("mongoose");

const connectionDb = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Getting error in Connecting to MongoDB");
    console.error(err);
  }
};

module.exports = connectionDb;
