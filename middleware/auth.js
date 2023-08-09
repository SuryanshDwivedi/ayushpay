const jwt = require("jsonwebtoken")
const createError = require("../middleware/error")

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err,value)=>{
        if(err) {
            return next(createError(403, "Token is not valid"))
        }
        req.user = value
    })
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {verifyToken}