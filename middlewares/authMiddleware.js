const jwt = require("jsonwebtoken");
const User = require("../models/user");

const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    }
    else{
      res.status(401).json({ message: "Not Authorized,token failed" });
    }
  } catch (error) {
    res.status(401).json({ message: "Not Authorized,token failed" });
  }
});

module.exports = { protect };
