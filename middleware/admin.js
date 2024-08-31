const jwt = require("jsonwebtoken");

async function validateAdmin(req, res, next) {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res.send(401, "you need to login first");
    }

    let data = await jwt.verify(token, process.env.JWT_KEY);
    req.user = data;
    next();
  } catch (error) {
    res.send(error.message);
  }
}
module.exports = validateAdmin;
