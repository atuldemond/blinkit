const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const path = require("path");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const paymentRouter = require("./routes/payment");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");

//dotenv
require("dotenv").config();

// Middleware
require("./config/google_oauth_config");

// Connect to MongoDB
const connectionDb = require("./config/mongoose");
const { Passport } = require("passport");
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
app.use(passport.initialize()); // Correct usage
app.use(passport.session());
app.use(cookieParser());
try {
  app.use("/", indexRouter);
  app.use("/auth", authRouter);
  app.use("/admin", adminRouter);
  app.use("/products", productRouter);
  app.use("/category", categoryRouter);
  app.use("/users", userRouter);
  app.use("/cart", cartRouter);
  app.use("/payment", paymentRouter);
  app.use("/order", orderRouter);
} catch (error) {
  console.error("Error setting up routes:", error);
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
