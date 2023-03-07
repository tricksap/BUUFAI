const express = require("express");
const { validateToken, checkRole } = require("../Helper/JWT");
const router = express.Router();

const multer = require("multer");
const {
  Return_Result,
  Insert_A_File_Return_Id,
} = require("../Helper/SQLQuery");
const mysql = require("mysql2");
const path = require("path");
const { compareArrays } = require("../Helper/ArrayCompare");

router
  .route("/CreateAdmin")
  .get(validateToken, checkRole(["Super_Admin"]), (req, res) => {
    res.render("createAdmin");
  });

router
  .route("/CreateAdmin")
  .post(validateToken, checkRole(["Super_Admin"]), (req, res) => {
    const {
      firstname,
      middlename,
      lastname,
      college,
      email,
      position,
      role,
      password,
    } = req.body;
    let query = "INSERT INTO admin SET ?";

    let data = {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      college: college,
      email: email,
      position: position,
      Role: role,
      password: password,
    };

    con.query(query, data, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect("/CreateAdmin");
    });
  });

module.exports = router;
