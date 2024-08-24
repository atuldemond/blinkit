const express = require("express")
const app = express();
const indexRouter = require("./routes/indexRouter")

app.use("/",indexRouter)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});