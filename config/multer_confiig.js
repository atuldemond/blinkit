const multer = require("multer");
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });
module.exports = upload;

// Example of storage configuration
