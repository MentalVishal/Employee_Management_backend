const jwt = require("jsonwebtoken");
const { blackListModel } = require("../Models/blacklistModel");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const black = await blackListModel.findOne({ token: token });
    if (black) {
      res.status(400).json({ msg: "Login Again..." });
    } else {
      jwt.verify(token, "masai", async (err, decoded) => {
        if (decoded) {
          req.body.user_email = decoded.email;
          next();
        } else {
          res.status(400).json({ error: "You are not Authorized" });
        }
      });
    }
  } else {
    res.status(400).json({ error: "Token not Present" });
  }
};

module.exports = {
  authMiddleware,
};
