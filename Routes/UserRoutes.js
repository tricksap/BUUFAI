const express = require("express");
const { validateToken, checkRole } = require("../Helper/JWT");
const router = express.Router();

//admin
router
  .route("/Users")
  .get(validateToken, checkRole(["Super_Admin"]), function (req, res) {
    let users;
    let query =
      "SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber FROM buufia.user";

    con.query(query, (err, result) => {
      if (err) throw err;
      users = result;
      res.render("AllUsers", { users });
    });
  });

//admin
router
  .route("/unverifiedUser")
  .get(validateToken, checkRole(["Super_Admin"]), (req, res) => {
    let users;
    let query =
      "SELECT Id,Email,Firstname,Middlename,Lastname,College,Verified,Gender,Birthday,PhoneNumber FROM buufia.user Where Verified = 0;";

    con.query(query, (err, result) => {
      if (err) throw err;
      users = result;
      res.render("Unverified", { users });
    });
  });

//admin
router
  .route("/verifyUser")
  .post(validateToken, checkRole(["Super_Admin"]), (req, res) => {
    let query = `UPDATE buufia.user SET Verified = '1' WHERE (Id = ${req.body.id});`;
    con.query(query, (err, result) => {
      if (err) throw err;
      users = result;
      res.redirect("/unverifiedUser");
    });
  });

module.exports = router;
