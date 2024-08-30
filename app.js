const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const path = require("path");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const expressSession = require("express-session");

//dotenv
require("dotenv").config();

// Middleware
require("./config/google_oauth_config");

// Connect to MongoDB
const connectionDb = require("./config/mongoose");
connectionDb();

// Bodyparser
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
