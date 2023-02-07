const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  const maxAge = 3 * 24 * 60 * 60;

  return jwt.sign(user, "Secret Token", { expiresIn: maxAge });
}

module.exports = { generateAccessToken };
