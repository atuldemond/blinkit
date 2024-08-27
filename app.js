const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const path = require("path");
// const authRouter = require("./routes/auth");

//dotenv
require("dotenv").config();

// Middleware
// require("./config/google_oauth_config");

// Connect to MongoDB
const connectionDb = require("./config/mongoose");
connectionDb();

// Bodyparser
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   expressSession({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false }, // Set to true if using HTTPS
//   })
// );

app.use("/", indexRouter);
// app.use("/auth", authRouter);
app.all("*", (req, res) => {
  res.status(404).send({
    message: "The requested resource was not found",
    method: req.method,
    url: req.originalUrl,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
