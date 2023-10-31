const jwt = require("jsonwebtoken");
require("dotenv").config();

const hash = process.env.JWT_HASH;

const createToken = (id) => {
  return jwt.sign({ id }, hash, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

module.exports = createToken;
