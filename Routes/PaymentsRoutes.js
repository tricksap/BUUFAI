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

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    if (!file) {
      cb(null, "");
    } else {
      cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    }
  },
});

const upload = multer({ storage: storage });

router
  .route("/payments")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), async (req, res) => {
    console.log("aaaaa");
    const month = req.query.month || new Date().getMonth() + 1; // default to current month
    const year = req.query.year || new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    console.log(req.query);
    console.log(
      `SELECT Email,paid,created_at,Firstname,Middlename,Lastname FROM user LEFT JOIN monthly_payments ON user.Id = monthly_payments.user_id and month = ${month} and year = ${year} where verified = 1;`
    );
    const users = await Return_Result(
      `SELECT Email,paid,created_at,Firstname,Middlename,Lastname FROM user LEFT JOIN monthly_payments ON user.Id = monthly_payments.user_id and month = ${month} and year = ${year} where verified = 1;`
    );
    res.render("Payments", {
      users: users,
      currentYear: currentYear,
      query: req.query,
    });
  });

router
  .route("/Newpayments")
  .get(validateToken, checkRole(["Super_Admin", "Admin"]), async (req, res) => {
    const users = await Return_Result(
      `SELECT Id,Firstname,Middlename,Lastname FROM buufia.user Where Verified = 1;`
    );

    if (req.query.user) {
      const last_payment_date = await Return_Result(
        `SELECT MAX(created_at) as last_payment_date FROM monthly_payments WHERE user_id = ${req.query.user}`
      );
    }

    res.render("NewPayment", { errormessage: "", users: users, query: "7" });
  });

router
  .route("/Newpayments")
  .post(
    validateToken,
    checkRole(["Super_Admin", "Admin"]),
    async (req, res) => {
      const { user, month, num_months, amount } = req.body;
      let amountInt = parseInt(amount);
      const created = await Return_Result(
        `INSERT INTO buufia.monthly_payments (user_id, month, year, paid, created_at) VALUES ("${user}", "${month}", YEAR(CURDATE()), ${amountInt}, NOW());`
      );

      console.log(created);
    }
  );

module.exports = router;
