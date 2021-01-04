const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    res.status(403).json("Unauthorized!");
  }
};

module.exports = verifyToken;
