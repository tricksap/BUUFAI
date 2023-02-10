const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  const maxAge = 3 * 24 * 60 * 60;

  return jwt.sign(user, "Secret Token", { expiresIn: maxAge });
}

function validateToken(req, res, next) {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, "Secret Token", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        res.locals.userID = decodedToken.id;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
}

const checkRole = (role) => {
  return (req, res, next) => {
    const token = req.cookies.jwt;
    let userRole = jwt.verify(token, "Secret Token").role;
    if (role.includes(userRole)) {
      // console.log(`${role} role granted`);
      next();
    } else {
      res.status(401).render("no_permissions");
      // send({
      // result: "error",
      // message: `No permission on this Part of the System`,
      // });
    }
  };
};

module.exports = { generateAccessToken, validateToken, checkRole };
