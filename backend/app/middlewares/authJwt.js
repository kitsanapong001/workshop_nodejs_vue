const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.replace('Bearer ','');
  }
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "Tokens expire!" });
    }
    req.user_id = decoded.id;
    next();
  });


};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
